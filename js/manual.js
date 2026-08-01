/**
 * ============================================================
 * ADCS Presença
 * manual.js
 * ------------------------------------------------------------
 * Responsável por coordenar o fluxo de registro por matrícula
 * e a interação com o formulário manual.
 * Conforme DEVSTD-001.
 * ============================================================
 */

"use strict";

import {
    alunoEstaAtivo,
    buscarAlunoPorMatricula,
    normalizarMatricula
} from "./aluno.js";

import { registrarPresenca } from "./presenca.js";

import {
    limparFeedback,
    mostrarLoading,
    mostrarMensagem,
    mostrarPresencaDuplicada,
    mostrarPresencaRegistrada,
    ocultarLoading
} from "./ui.js";

const ORIGEM_MANUAL = "MANUAL";

let processamentoEmAndamento = false;

/**
 * Inicializa o formulário de registro manual.
 */
export function initRegistroManual() {
    const elementos = obterElementosFormulario();

    elementos.form.addEventListener("submit", (evento) => {
        void processarFormularioManual(evento, elementos);
    });
}

/**
 * Executa o caso de uso de registro por matrícula.
 *
 * Esta função não acessa elementos do formulário e poderá ser
 * reutilizada pelo scanner de QR Code.
 *
 * @param {{
 *     professor: {
 *         id: string,
 *         nome: string
 *     },
 *     matricula: string,
 *     origem: "MANUAL" | "QR_CODE"
 * }} dados
 *
 * @returns {Promise<
 *     {
 *         status: "registrada" | "duplicada",
 *         aluno: {
 *             id: string,
 *             nome: string,
 *             matricula: string,
 *             faixa: string,
 *             ativo: boolean
 *         },
 *         presenca: {
 *             status: "registrada" | "duplicada",
 *             id: string,
 *             dia: string
 *         }
 *     }
 * >}
 */
export async function executarRegistroPorMatricula(dados) {
    const professor = validarProfessor(dados?.professor);
    const matricula = normalizarMatricula(dados?.matricula);
    const origem = normalizarOrigem(dados?.origem);

    if (!matricula) {
        throw criarErroRegistro(
            "MATRICULA_OBRIGATORIA",
            "A matrícula do aluno é obrigatória."
        );
    }

    const aluno = await buscarAlunoPorMatricula(matricula);

    if (!aluno) {
        throw criarErroRegistro(
            "ALUNO_NAO_ENCONTRADO",
            "Nenhum aluno foi encontrado com essa matrícula."
        );
    }

    if (!alunoEstaAtivo(aluno)) {
        throw criarErroRegistro(
            "ALUNO_INATIVO",
            `O aluno ${obterNomeExibicao(aluno.nome)} está inativo e não pode registrar presença.`
        );
    }

    const presenca = await registrarPresenca({
        aluno,
        professor,
        origem
    });

    return {
        status: presenca.status,
        aluno,
        presenca
    };
}

/**
 * Processa o envio do formulário manual.
 *
 * @param {SubmitEvent} evento
 * @param {{
 *     form: HTMLFormElement,
 *     selectProfessor: HTMLSelectElement,
 *     inputMatricula: HTMLInputElement,
 *     botaoRegistrar: HTMLButtonElement
 * }} elementos
 *
 * @returns {Promise<void>}
 */
async function processarFormularioManual(evento, elementos) {
    evento.preventDefault();

    if (processamentoEmAndamento) {
        return;
    }

    limparFeedback();

    const professor = obterProfessorSelecionado(
        elementos.selectProfessor
    );

    const matricula = normalizarMatricula(
        elementos.inputMatricula.value
    );

    if (!professor) {
        mostrarMensagem(
            "Selecione o professor responsável pela aula.",
            "warning"
        );

        elementos.selectProfessor.focus();

        return;
    }

    if (!matricula) {
        mostrarMensagem(
            "Informe a matrícula do aluno.",
            "warning"
        );

        elementos.inputMatricula.focus();

        return;
    }

    iniciarProcessamento(elementos.botaoRegistrar);

    try {
        const resultado = await executarRegistroPorMatricula({
            professor,
            matricula,
            origem: ORIGEM_MANUAL
        });

        if (resultado.status === "duplicada") {
            mostrarPresencaDuplicada(resultado.aluno);
            selecionarMatricula(elementos.inputMatricula);

            registrarLogDuplicidade(resultado, professor);

            return;
        }

        mostrarPresencaRegistrada(resultado.aluno);
        limparFormularioAposSucesso(elementos);

        registrarLogSucesso(resultado, professor);
    } catch (erro) {
        tratarErroRegistroManual(erro, elementos);
    } finally {
        finalizarProcessamento(elementos.botaoRegistrar);
    }
}

/**
 * Obtém e valida os elementos do formulário.
 *
 * @returns {{
 *     form: HTMLFormElement,
 *     selectProfessor: HTMLSelectElement,
 *     inputMatricula: HTMLInputElement,
 *     botaoRegistrar: HTMLButtonElement
 * }}
 */
function obterElementosFormulario() {
    const form = document.getElementById("formRegistroManual");
    const selectProfessor = document.getElementById("professor");
    const inputMatricula = document.getElementById("matricula");
    const botaoRegistrar = document.getElementById(
        "btnRegistrarManual"
    );

    if (!(form instanceof HTMLFormElement)) {
        throw new Error(
            'O formulário "#formRegistroManual" não foi encontrado.'
        );
    }

    if (!(selectProfessor instanceof HTMLSelectElement)) {
        throw new Error(
            'O campo "#professor" não foi encontrado.'
        );
    }

    if (!(inputMatricula instanceof HTMLInputElement)) {
        throw new Error(
            'O campo "#matricula" não foi encontrado.'
        );
    }

    if (!(botaoRegistrar instanceof HTMLButtonElement)) {
        throw new Error(
            'O botão "#btnRegistrarManual" não foi encontrado.'
        );
    }

    return {
        form,
        selectProfessor,
        inputMatricula,
        botaoRegistrar
    };
}

/**
 * Retorna os dados do professor selecionado.
 *
 * @param {HTMLSelectElement} selectProfessor
 * @returns {{id: string, nome: string} | null}
 */
function obterProfessorSelecionado(selectProfessor) {
    const professorId = selectProfessor.value.trim();

    if (!professorId) {
        return null;
    }

    const opcaoSelecionada =
        selectProfessor.options[selectProfessor.selectedIndex];

    const nomeProfessor =
        opcaoSelecionada?.textContent?.trim() || "";

    if (!nomeProfessor) {
        throw new Error(
            "O nome do professor selecionado não foi encontrado."
        );
    }

    return {
        id: professorId,
        nome: nomeProfessor
    };
}

/**
 * Valida os dados do professor.
 *
 * @param {unknown} professor
 * @returns {{id: string, nome: string}}
 */
function validarProfessor(professor) {
    if (!professor || typeof professor !== "object") {
        throw criarErroRegistro(
            "PROFESSOR_OBRIGATORIO",
            "Selecione o professor responsável pela aula."
        );
    }

    const id =
        typeof professor.id === "string"
            ? professor.id.trim()
            : "";

    const nome =
        typeof professor.nome === "string"
            ? professor.nome.trim()
            : "";

    if (!id || !nome) {
        throw criarErroRegistro(
            "PROFESSOR_OBRIGATORIO",
            "Selecione o professor responsável pela aula."
        );
    }

    return {
        id,
        nome
    };
}

/**
 * Normaliza a origem do registro.
 *
 * @param {unknown} origem
 * @returns {"MANUAL" | "QR_CODE"}
 */
function normalizarOrigem(origem) {
    const origemNormalizada =
        typeof origem === "string"
            ? origem.trim().toLocaleUpperCase("pt-BR")
            : "";

    if (
        origemNormalizada !== "MANUAL" &&
        origemNormalizada !== "QR_CODE"
    ) {
        throw criarErroRegistro(
            "ORIGEM_INVALIDA",
            "A origem do registro é inválida."
        );
    }

    return origemNormalizada;
}

/**
 * Cria um erro identificável pelo fluxo de apresentação.
 *
 * @param {string} codigo
 * @param {string} mensagem
 * @returns {Error & {codigo: string}}
 */
function criarErroRegistro(codigo, mensagem) {
    const erro = new Error(mensagem);

    erro.codigo = codigo;

    return erro;
}

/**
 * Trata falhas do fluxo manual.
 *
 * @param {unknown} erro
 * @param {{
 *     selectProfessor: HTMLSelectElement,
 *     inputMatricula: HTMLInputElement
 * }} elementos
 */
function tratarErroRegistroManual(erro, elementos) {
    console.error(
        "Erro ao processar o registro manual:",
        erro
    );

    const codigo =
        erro && typeof erro === "object"
            ? erro.codigo
            : "";

    if (codigo === "PROFESSOR_OBRIGATORIO") {
        mostrarMensagem(
            erro.message,
            "warning"
        );

        elementos.selectProfessor.focus();

        return;
    }

    if (codigo === "MATRICULA_OBRIGATORIA") {
        mostrarMensagem(
            erro.message,
            "warning"
        );

        elementos.inputMatricula.focus();

        return;
    }

    if (codigo === "ALUNO_NAO_ENCONTRADO") {
        mostrarMensagem(
            erro.message,
            "error"
        );

        selecionarMatricula(elementos.inputMatricula);

        return;
    }

    if (codigo === "ALUNO_INATIVO") {
        mostrarMensagem(
            erro.message,
            "warning"
        );

        selecionarMatricula(elementos.inputMatricula);

        return;
    }

    mostrarMensagem(
        "Não foi possível registrar a presença. Verifique sua conexão e tente novamente.",
        "error"
    );

    elementos.inputMatricula.focus();
}

/**
 * Ativa o estado de processamento.
 *
 * @param {HTMLButtonElement} botaoRegistrar
 */
function iniciarProcessamento(botaoRegistrar) {
    processamentoEmAndamento = true;

    botaoRegistrar.disabled = true;
    botaoRegistrar.setAttribute("aria-busy", "true");

    mostrarLoading("Localizando aluno...");
}

/**
 * Encerra o estado de processamento.
 *
 * @param {HTMLButtonElement} botaoRegistrar
 */
function finalizarProcessamento(botaoRegistrar) {
    ocultarLoading();

    botaoRegistrar.disabled = false;
    botaoRegistrar.removeAttribute("aria-busy");

    processamentoEmAndamento = false;
}

/**
 * Limpa o campo após um registro bem-sucedido.
 *
 * @param {{inputMatricula: HTMLInputElement}} elementos
 */
function limparFormularioAposSucesso(elementos) {
    elementos.inputMatricula.value = "";
    elementos.inputMatricula.focus();
}

/**
 * Seleciona o conteúdo da matrícula.
 *
 * @param {HTMLInputElement} inputMatricula
 */
function selecionarMatricula(inputMatricula) {
    inputMatricula.focus();
    inputMatricula.select();
}

/**
 * Registra o cenário de sucesso no console.
 *
 * @param {{
 *     aluno: {id: string},
 *     presenca: {id: string, dia: string}
 * }} resultado
 * @param {{id: string}} professor
 */
function registrarLogSucesso(resultado, professor) {
    console.info(
        "Presença manual registrada com sucesso:",
        {
            presencaId: resultado.presenca.id,
            dia: resultado.presenca.dia,
            alunoId: resultado.aluno.id,
            professorId: professor.id
        }
    );
}

/**
 * Registra o cenário de duplicidade no console.
 *
 * @param {{
 *     aluno: {id: string},
 *     presenca: {id: string, dia: string}
 * }} resultado
 * @param {{id: string}} professor
 */
function registrarLogDuplicidade(resultado, professor) {
    console.info(
        "Presença manual já registrada anteriormente:",
        {
            presencaId: resultado.presenca.id,
            dia: resultado.presenca.dia,
            alunoId: resultado.aluno.id,
            professorId: professor.id
        }
    );
}

/**
 * Retorna um nome adequado para exibição.
 *
 * @param {string} nome
 * @returns {string}
 */
function obterNomeExibicao(nome) {
    if (typeof nome !== "string") {
        return "Aluno sem nome cadastrado";
    }

    return nome.trim() || "Aluno sem nome cadastrado";
}