/**
 * ============================================================
 * ADCS Presença
 * scanner.js
 * ------------------------------------------------------------
 * Responsável pelo ciclo de vida da câmera, leitura do QR Code
 * e integração com o registro por matrícula.
 * Conforme DEVSTD-001.
 * ============================================================
 */

"use strict";

import { executarRegistroPorMatricula } from "./manual.js";

import {
    limparFeedback,
    mostrarLoading,
    mostrarMensagem,
    mostrarPresencaDuplicada,
    mostrarPresencaRegistrada,
    ocultarLoading
} from "./ui.js";

const ORIGEM_QR_CODE = "QR_CODE";
const INTERVALO_ANTI_RELEITURA_MS = 2500;
const FPS_SCANNER = 10;

let scanner = null;
let cameraAtiva = false;
let inicializacaoEmAndamento = false;
let processamentoEmAndamento = false;
let moduloInicializado = false;

let ultimaMatriculaLida = "";
let horarioUltimaLeitura = 0;

/**
 * Inicializa os controles do scanner.
 */
export function initScanner() {
    if (moduloInicializado) {
        return;
    }

    const elementos = obterElementosScanner();

    elementos.btnIniciar.addEventListener("click", () => {
        void iniciarScanner(elementos);
    });

    elementos.btnEncerrar.addEventListener("click", () => {
        void pararScanner(elementos);
    });

    elementos.btnModoManual.addEventListener("click", () => {
        if (cameraAtiva || inicializacaoEmAndamento) {
            void pararScanner(elementos);
        }
    });

    window.addEventListener("beforeunload", () => {
        if (cameraAtiva) {
            void pararScanner(elementos);
        }
    });

    atualizarInterfaceCameraDesligada(elementos);

    moduloInicializado = true;
}

/**
 * Inicia a câmera e a leitura contínua de QR Codes.
 *
 * @param {ReturnType<typeof obterElementosScanner>} elementos
 * @returns {Promise<void>}
 */
async function iniciarScanner(elementos) {
    if (cameraAtiva || inicializacaoEmAndamento) {
        return;
    }

    limparFeedback();

    const professor = obterProfessorSelecionado(
        elementos.selectProfessor
    );

    if (!professor) {
        mostrarMensagem(
            "Selecione o professor responsável antes de iniciar a câmera.",
            "warning"
        );

        elementos.selectProfessor.focus();

        return;
    }

    if (!bibliotecaScannerDisponivel()) {
        mostrarMensagem(
            "O recurso de leitura por QR Code não está disponível.",
            "error"
        );

        console.error(
            "A biblioteca Html5Qrcode não foi encontrada."
        );

        return;
    }

    inicializacaoEmAndamento = true;
    atualizarInterfaceCameraIniciando(elementos);
    mostrarLoading("Iniciando câmera...");

    try {
        const camera = await selecionarCamera();
        const configuracao = criarConfiguracaoScanner(
            elementos.reader
        );

        scanner = new window.Html5Qrcode(
            elementos.reader.id
        );

        await scanner.start(
            camera.id,
            configuracao,
            (textoLido) => {
                void processarLeitura(
                    textoLido,
                    elementos
                );
            },
            () => {
                // Falhas de decodificação entre quadros são esperadas.
            }
        );

        cameraAtiva = true;
        atualizarInterfaceCameraAtiva(elementos);

        console.info("Scanner de QR Code iniciado.", {
            cameraId: camera.id,
            cameraLabel: camera.label || "Não informada"
        });
    } catch (erro) {
        console.error(
            "Não foi possível iniciar o scanner:",
            erro
        );

        await limparInstanciaScanner();

        mostrarMensagem(
            obterMensagemErroCamera(erro),
            "error"
        );

        atualizarInterfaceCameraDesligada(elementos);
    } finally {
        inicializacaoEmAndamento = false;
        ocultarLoading();
    }
}

/**
 * Encerra a câmera com segurança.
 *
 * @param {ReturnType<typeof obterElementosScanner>} elementos
 * @returns {Promise<void>}
 */
export async function pararScanner(elementos = obterElementosScanner()) {
    if (!scanner) {
        cameraAtiva = false;
        inicializacaoEmAndamento = false;
        atualizarInterfaceCameraDesligada(elementos);

        return;
    }

    elementos.btnEncerrar.disabled = true;

    try {
        if (cameraAtiva) {
            await scanner.stop();
        }
    } catch (erro) {
        console.warn(
            "O scanner não pôde ser interrompido normalmente:",
            erro
        );
    } finally {
        await limparInstanciaScanner();

        cameraAtiva = false;
        inicializacaoEmAndamento = false;
        processamentoEmAndamento = false;

        ultimaMatriculaLida = "";
        horarioUltimaLeitura = 0;

        atualizarInterfaceCameraDesligada(elementos);

        console.info("Scanner de QR Code encerrado.");
    }
}

/**
 * Processa o conteúdo reconhecido no QR Code.
 *
 * @param {string} textoLido
 * @param {ReturnType<typeof obterElementosScanner>} elementos
 * @returns {Promise<void>}
 */
async function processarLeitura(textoLido, elementos) {
    if (
        !cameraAtiva ||
        processamentoEmAndamento
    ) {
        return;
    }

    const matricula = extrairMatricula(textoLido);

    if (!matricula) {
        mostrarMensagem(
            "O QR Code lido não contém uma matrícula válida.",
            "warning"
        );

        return;
    }

    if (leituraEstaBloqueada(matricula)) {
        return;
    }

    registrarLeituraTemporaria(matricula);

    const professor = obterProfessorSelecionado(
        elementos.selectProfessor
    );

    if (!professor) {
        mostrarMensagem(
            "Selecione o professor responsável pela aula.",
            "warning"
        );

        elementos.selectProfessor.focus();

        return;
    }

    processamentoEmAndamento = true;
    elementos.btnEncerrar.disabled = true;

    limparFeedback();
    mostrarLoading("Registrando presença pelo QR Code...");

    try {
        const resultado = await executarRegistroPorMatricula({
            professor,
            matricula,
            origem: ORIGEM_QR_CODE
        });

        if (resultado.status === "duplicada") {
            mostrarPresencaDuplicada(resultado.aluno);

            console.info(
                "Presença por QR Code já registrada anteriormente:",
                {
                    presencaId: resultado.presenca.id,
                    dia: resultado.presenca.dia,
                    alunoId: resultado.aluno.id,
                    professorId: professor.id
                }
            );

            emitirFeedbackDispositivo("duplicada");

            return;
        }

        mostrarPresencaRegistrada(resultado.aluno);

        console.info(
            "Presença por QR Code registrada com sucesso:",
            {
                presencaId: resultado.presenca.id,
                dia: resultado.presenca.dia,
                alunoId: resultado.aluno.id,
                professorId: professor.id
            }
        );

        emitirFeedbackDispositivo("sucesso");
    } catch (erro) {
        tratarErroLeitura(erro);
        emitirFeedbackDispositivo("erro");
    } finally {
        ocultarLoading();

        elementos.btnEncerrar.disabled = false;
        processamentoEmAndamento = false;
    }
}

/**
 * Seleciona preferencialmente a câmera traseira.
 *
 * @returns {Promise<{id: string, label: string}>}
 */
async function selecionarCamera() {
    const cameras = await window.Html5Qrcode.getCameras();

    if (!Array.isArray(cameras) || cameras.length === 0) {
        throw new Error("CAMERA_NAO_ENCONTRADA");
    }

    const cameraTraseira = cameras.find((camera) => {
        const label = camera.label
            .toLocaleLowerCase("pt-BR");

        return (
            label.includes("back") ||
            label.includes("rear") ||
            label.includes("environment") ||
            label.includes("traseira")
        );
    });

    return cameraTraseira || cameras[0];
}

/**
 * Cria a configuração responsiva da leitura.
 *
 * @param {HTMLElement} reader
 * @returns {{
 *     fps: number,
 *     qrbox: {width: number, height: number},
 *     aspectRatio: number
 * }}
 */
function criarConfiguracaoScanner(reader) {
    const larguraDisponivel =
        reader.clientWidth || 320;

    const tamanhoLeitura = Math.round(
        Math.min(
            260,
            Math.max(180, larguraDisponivel * 0.72)
        )
    );

    return {
        fps: FPS_SCANNER,
        qrbox: {
            width: tamanhoLeitura,
            height: tamanhoLeitura
        },
        aspectRatio: 1
    };
}

/**
 * Extrai a matrícula do conteúdo do QR Code.
 *
 * São aceitos:
 * - matrícula em texto simples;
 * - JSON contendo a propriedade "matricula";
 * - URL contendo o parâmetro "matricula".
 *
 * @param {unknown} textoLido
 * @returns {string}
 */
function extrairMatricula(textoLido) {
    if (typeof textoLido !== "string") {
        return "";
    }

    const conteudo = textoLido.trim();

    if (!conteudo) {
        return "";
    }

    const matriculaJson = extrairMatriculaDeJson(conteudo);

    if (matriculaJson) {
        return matriculaJson;
    }

    const matriculaUrl = extrairMatriculaDeUrl(conteudo);

    if (matriculaUrl) {
        return matriculaUrl;
    }

    return conteudo;
}

/**
 * @param {string} conteudo
 * @returns {string}
 */
function extrairMatriculaDeJson(conteudo) {
    try {
        const dados = JSON.parse(conteudo);

        return typeof dados?.matricula === "string"
            ? dados.matricula.trim()
            : "";
    } catch {
        return "";
    }
}

/**
 * @param {string} conteudo
 * @returns {string}
 */
function extrairMatriculaDeUrl(conteudo) {
    try {
        const url = new URL(conteudo);
        return url.searchParams.get("matricula")?.trim() || "";
    } catch {
        return "";
    }
}

/**
 * Impede releituras consecutivas do mesmo QR Code.
 *
 * @param {string} matricula
 * @returns {boolean}
 */
function leituraEstaBloqueada(matricula) {
    const agora = Date.now();

    return (
        matricula === ultimaMatriculaLida &&
        agora - horarioUltimaLeitura <
            INTERVALO_ANTI_RELEITURA_MS
    );
}

/**
 * @param {string} matricula
 */
function registrarLeituraTemporaria(matricula) {
    ultimaMatriculaLida = matricula;
    horarioUltimaLeitura = Date.now();
}

/**
 * Retorna os dados do professor selecionado.
 *
 * @param {HTMLSelectElement} selectProfessor
 * @returns {{id: string, nome: string} | null}
 */
function obterProfessorSelecionado(selectProfessor) {
    const id = selectProfessor.value.trim();

    if (!id) {
        return null;
    }

    const opcao =
        selectProfessor.options[
            selectProfessor.selectedIndex
        ];

    const nome = opcao?.textContent?.trim() || "";

    if (!nome) {
        return null;
    }

    return {
        id,
        nome
    };
}

/**
 * Trata erros provenientes do fluxo compartilhado.
 *
 * @param {unknown} erro
 */
function tratarErroLeitura(erro) {
    console.error(
        "Erro ao processar a leitura do QR Code:",
        erro
    );

    const codigo =
        erro && typeof erro === "object"
            ? erro.codigo
            : "";

    if (codigo === "ALUNO_NAO_ENCONTRADO") {
        mostrarMensagem(
            erro.message,
            "error"
        );

        return;
    }

    if (codigo === "ALUNO_INATIVO") {
        mostrarMensagem(
            erro.message,
            "warning"
        );

        return;
    }

    if (codigo === "MATRICULA_OBRIGATORIA") {
        mostrarMensagem(
            "O QR Code não contém uma matrícula válida.",
            "warning"
        );

        return;
    }

    mostrarMensagem(
        "Não foi possível registrar a presença pelo QR Code.",
        "error"
    );
}

/**
 * Emite vibração quando suportada pelo dispositivo.
 *
 * @param {"sucesso" | "duplicada" | "erro"} tipo
 */
function emitirFeedbackDispositivo(tipo) {
    if (!("vibrate" in navigator)) {
        return;
    }

    if (tipo === "sucesso") {
        navigator.vibrate(120);
        return;
    }

    if (tipo === "duplicada") {
        navigator.vibrate([80, 60, 80]);
        return;
    }

    navigator.vibrate([150, 80, 150]);
}

/**
 * Limpa a instância da biblioteca.
 *
 * @returns {Promise<void>}
 */
async function limparInstanciaScanner() {
    if (!scanner) {
        return;
    }

    try {
        await scanner.clear();
    } catch (erro) {
        console.warn(
            "Não foi possível limpar completamente o scanner:",
            erro
        );
    }

    scanner = null;
}

/**
 * Atualiza a interface para câmera em inicialização.
 *
 * @param {ReturnType<typeof obterElementosScanner>} elementos
 */
function atualizarInterfaceCameraIniciando(elementos) {
    elementos.btnIniciar.disabled = true;
    elementos.btnIniciar.setAttribute("aria-busy", "true");

    elementos.btnEncerrar.hidden = true;
    elementos.placeholder.hidden = false;
}

/**
 * Atualiza a interface para câmera ativa.
 *
 * @param {ReturnType<typeof obterElementosScanner>} elementos
 */
function atualizarInterfaceCameraAtiva(elementos) {
    elementos.btnIniciar.hidden = true;
    elementos.btnIniciar.disabled = false;
    elementos.btnIniciar.removeAttribute("aria-busy");

    elementos.btnEncerrar.hidden = false;
    elementos.btnEncerrar.disabled = false;

    elementos.placeholder.hidden = true;
}

/**
 * Atualiza a interface para câmera desligada.
 *
 * @param {ReturnType<typeof obterElementosScanner>} elementos
 */
function atualizarInterfaceCameraDesligada(elementos) {
    elementos.btnIniciar.hidden = false;
    elementos.btnIniciar.disabled = false;
    elementos.btnIniciar.removeAttribute("aria-busy");

    elementos.btnEncerrar.hidden = true;
    elementos.btnEncerrar.disabled = false;

    elementos.placeholder.hidden = false;
}

/**
 * Retorna uma mensagem amigável para falhas de câmera.
 *
 * @param {unknown} erro
 * @returns {string}
 */
function obterMensagemErroCamera(erro) {
    const mensagem =
        erro instanceof Error
            ? erro.message.toLocaleLowerCase("pt-BR")
            : String(erro).toLocaleLowerCase("pt-BR");

    if (mensagem.includes("camera_nao_encontrada")) {
        return "Nenhuma câmera foi encontrada neste dispositivo.";
    }

    if (
        mensagem.includes("notallowed") ||
        mensagem.includes("permission") ||
        mensagem.includes("denied")
    ) {
        return (
            "O acesso à câmera foi negado. " +
            "Autorize a câmera nas configurações do navegador."
        );
    }

    if (
        mensagem.includes("notfound") ||
        mensagem.includes("devicesnotfound")
    ) {
        return "Nenhuma câmera disponível foi encontrada.";
    }

    if (
        mensagem.includes("notreadable") ||
        mensagem.includes("trackstarterror")
    ) {
        return (
            "A câmera está sendo utilizada por outro aplicativo."
        );
    }

    return (
        "Não foi possível iniciar a câmera. " +
        "Verifique as permissões e tente novamente."
    );
}

/**
 * Verifica se a biblioteca externa foi carregada.
 *
 * @returns {boolean}
 */
function bibliotecaScannerDisponivel() {
    return typeof window.Html5Qrcode === "function";
}

/**
 * Obtém os elementos utilizados pelo scanner.
 *
 * @returns {{
 *     reader: HTMLElement,
 *     placeholder: HTMLElement,
 *     btnIniciar: HTMLButtonElement,
 *     btnEncerrar: HTMLButtonElement,
 *     btnModoManual: HTMLButtonElement,
 *     selectProfessor: HTMLSelectElement
 * }}
 */
function obterElementosScanner() {
    const reader = document.getElementById("reader");
    const placeholder = document.getElementById(
        "scannerPlaceholder"
    );

    const btnIniciar = document.getElementById(
        "btnIniciarCamera"
    );

    const btnEncerrar = document.getElementById(
        "btnEncerrarCamera"
    );

    const btnModoManual = document.getElementById(
        "btnModoManual"
    );

    const selectProfessor = document.getElementById(
        "professor"
    );

    if (!reader) {
        throw new Error(
            'A área de leitura "#reader" não foi encontrada.'
        );
    }

    if (!placeholder) {
        throw new Error(
            'O placeholder do scanner não foi encontrado.'
        );
    }

    if (!(btnIniciar instanceof HTMLButtonElement)) {
        throw new Error(
            'O botão "#btnIniciarCamera" não foi encontrado.'
        );
    }

    if (!(btnEncerrar instanceof HTMLButtonElement)) {
        throw new Error(
            'O botão "#btnEncerrarCamera" não foi encontrado.'
        );
    }

    if (!(btnModoManual instanceof HTMLButtonElement)) {
        throw new Error(
            'O botão "#btnModoManual" não foi encontrado.'
        );
    }

    if (!(selectProfessor instanceof HTMLSelectElement)) {
        throw new Error(
            'O campo "#professor" não foi encontrado.'
        );
    }

    return {
        reader,
        placeholder,
        btnIniciar,
        btnEncerrar,
        btnModoManual,
        selectProfessor
    };
}