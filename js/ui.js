/**
 * ============================================================
 * ADCS Presença
 * ui.js
 * ------------------------------------------------------------
 * Responsável pelo comportamento da interface do usuário.
 * Conforme DEVSTD-001.
 * ============================================================
 */

"use strict";

/**
 * Inicializa os comportamentos da interface.
 */
export function initUI() {
    configurarModoEntrada();
    ocultarLoading();
    ocultarMensagem();
    ocultarResultado();
}

/**
 * Configura a alternância entre os modos Manual e QR Code.
 */
function configurarModoEntrada() {
    const btnModoManual = document.getElementById("btnModoManual");
    const btnModoCamera = document.getElementById("btnModoCamera");
    const painelManual = document.getElementById("painelManual");
    const painelCamera = document.getElementById("painelCamera");

    if (
        !btnModoManual ||
        !btnModoCamera ||
        !painelManual ||
        !painelCamera
    ) {
        console.warn(
            "Não foi possível configurar os modos de registro: " +
            "elementos obrigatórios não encontrados."
        );

        return;
    }

    btnModoManual.addEventListener("click", () => {
        ativarModoManual(
            btnModoManual,
            btnModoCamera,
            painelManual,
            painelCamera
        );
    });

    btnModoCamera.addEventListener("click", () => {
        ativarModoCamera(
            btnModoManual,
            btnModoCamera,
            painelManual,
            painelCamera
        );
    });

    ativarModoManual(
        btnModoManual,
        btnModoCamera,
        painelManual,
        painelCamera
    );
}

/**
 * Ativa o modo de registro manual.
 *
 * @param {HTMLButtonElement} btnModoManual
 * @param {HTMLButtonElement} btnModoCamera
 * @param {HTMLElement} painelManual
 * @param {HTMLElement} painelCamera
 */
function ativarModoManual(
    btnModoManual,
    btnModoCamera,
    painelManual,
    painelCamera
) {
    painelManual.hidden = false;
    painelCamera.hidden = true;

    btnModoManual.classList.add(
        "registration-mode__button--active"
    );

    btnModoCamera.classList.remove(
        "registration-mode__button--active"
    );

    btnModoManual.setAttribute("aria-pressed", "true");
    btnModoCamera.setAttribute("aria-pressed", "false");

    limparFeedback();
}

/**
 * Ativa o modo de leitura por QR Code.
 *
 * @param {HTMLButtonElement} btnModoManual
 * @param {HTMLButtonElement} btnModoCamera
 * @param {HTMLElement} painelManual
 * @param {HTMLElement} painelCamera
 */
function ativarModoCamera(
    btnModoManual,
    btnModoCamera,
    painelManual,
    painelCamera
) {
    painelManual.hidden = true;
    painelCamera.hidden = false;

    btnModoManual.classList.remove(
        "registration-mode__button--active"
    );

    btnModoCamera.classList.add(
        "registration-mode__button--active"
    );

    btnModoManual.setAttribute("aria-pressed", "false");
    btnModoCamera.setAttribute("aria-pressed", "true");

    limparFeedback();
}

/**
 * Exibe o indicador de carregamento.
 *
 * @param {string} texto
 */
export function mostrarLoading(texto = "Processando...") {
    const loading = document.getElementById("loadingPresenca");
    const loadingTexto = document.getElementById("loadingTexto");

    if (!loading) {
        return;
    }

    if (loadingTexto) {
        loadingTexto.textContent = texto;
    }

    loading.hidden = false;
}

/**
 * Oculta o indicador de carregamento.
 */
export function ocultarLoading() {
    const loading = document.getElementById("loadingPresenca");

    if (!loading) {
        return;
    }

    loading.hidden = true;
}

/**
 * Exibe uma mensagem para o usuário.
 *
 * @param {string} texto
 * @param {"success"|"error"|"warning"|"info"} tipo
 */
export function mostrarMensagem(texto, tipo = "info") {
    const mensagem = document.getElementById("mensagem");

    if (!mensagem) {
        return;
    }

    mensagem.textContent = texto;
    mensagem.className = `feedback feedback--${tipo}`;
    mensagem.hidden = false;
}

/**
 * Oculta e limpa a mensagem apresentada.
 */
export function ocultarMensagem() {
    const mensagem = document.getElementById("mensagem");

    if (!mensagem) {
        return;
    }

    mensagem.textContent = "";
    mensagem.className = "feedback";
    mensagem.hidden = true;
}

/**
 * Exibe o cartão com os dados de um aluno localizado.
 *
 * @param {{
 *     nome: string,
 *     matricula: string,
 *     faixa: string
 * }} aluno
 */
export function mostrarResultadoAluno(aluno) {
    preencherResultado({
        classe: "result-card",
        icone: "✓",
        status: "Aluno localizado",
        nome: obterNomeExibicao(aluno.nome),
        detalhes: montarDetalhesAluno(aluno),
        complemento:
            "Dados validados para o registro de presença."
    });
}

/**
 * Exibe o cartão de presença registrada.
 *
 * @param {{
 *     nome: string,
 *     matricula: string,
 *     faixa: string
 * }} aluno
 */
export function mostrarPresencaRegistrada(aluno) {
    preencherResultado({
        classe: "result-card",
        icone: "✓",
        status: "Presença registrada",
        nome: obterNomeExibicao(aluno.nome),
        detalhes: montarDetalhesAluno(aluno),
        complemento: `Registrada às ${obterHorarioAtual()}.`
    });
}

/**
 * Exibe o cartão de presença duplicada.
 *
 * @param {{
 *     nome: string,
 *     matricula: string,
 *     faixa: string
 * }} aluno
 */
export function mostrarPresencaDuplicada(aluno) {
    preencherResultado({
        classe: "result-card result-card--duplicate",
        icone: "!",
        status: "Presença já registrada",
        nome: obterNomeExibicao(aluno.nome),
        detalhes: montarDetalhesAluno(aluno),
        complemento:
            "Este aluno já possui presença registrada hoje."
    });
}

/**
 * Oculta e restaura o cartão de resultado.
 */
export function ocultarResultado() {
    const cartao = document.getElementById("resultadoPresenca");

    if (!cartao) {
        return;
    }

    cartao.hidden = true;
    cartao.className = "result-card";
}

/**
 * Limpa mensagens e resultados anteriores.
 */
export function limparFeedback() {
    ocultarMensagem();
    ocultarResultado();
}

/**
 * Preenche e exibe o cartão de resultado.
 *
 * @param {{
 *     classe: string,
 *     icone: string,
 *     status: string,
 *     nome: string,
 *     detalhes: string,
 *     complemento: string
 * }} dados
 */
function preencherResultado(dados) {
    const elementos = obterElementosResultado();

    elementos.cartao.className = dados.classe;
    elementos.icone.textContent = dados.icone;
    elementos.status.textContent = dados.status;
    elementos.nome.textContent = dados.nome;
    elementos.detalhes.textContent = dados.detalhes;
    elementos.horario.textContent = dados.complemento;

    elementos.cartao.hidden = false;
}

/**
 * Obtém os elementos do cartão de resultado.
 *
 * @returns {{
 *     cartao: HTMLElement,
 *     icone: HTMLElement,
 *     status: HTMLElement,
 *     nome: HTMLElement,
 *     detalhes: HTMLElement,
 *     horario: HTMLElement
 * }}
 */
function obterElementosResultado() {
    const cartao = document.getElementById("resultadoPresenca");
    const icone = document.getElementById("resultadoIcone");
    const status = document.getElementById("resultadoStatus");
    const nome = document.getElementById("tituloResultado");
    const detalhes = document.getElementById("resultadoDetalhes");
    const horario = document.getElementById("resultadoHorario");

    if (
        !cartao ||
        !icone ||
        !status ||
        !nome ||
        !detalhes ||
        !horario
    ) {
        throw new Error(
            "Os elementos do cartão de resultado não foram encontrados."
        );
    }

    return {
        cartao,
        icone,
        status,
        nome,
        detalhes,
        horario
    };
}

/**
 * Monta o texto complementar do aluno.
 *
 * @param {{
 *     matricula: string,
 *     faixa: string
 * }} aluno
 * @returns {string}
 */
function montarDetalhesAluno(aluno) {
    const matricula = aluno.matricula || "Não informada";
    const faixa = formatarFaixa(aluno.faixa);

    return `Matrícula ${matricula} • Faixa ${faixa}`;
}

/**
 * Retorna o nome adequado para apresentação.
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

/**
 * Formata a faixa para apresentação.
 *
 * @param {string} faixa
 * @returns {string}
 */
function formatarFaixa(faixa) {
    if (typeof faixa !== "string" || faixa.trim() === "") {
        return "não informada";
    }

    const faixaNormalizada = faixa
        .trim()
        .toLocaleLowerCase("pt-BR");

    return (
        faixaNormalizada.charAt(0).toLocaleUpperCase("pt-BR") +
        faixaNormalizada.slice(1)
    );
}

/**
 * Retorna o horário local atual.
 *
 * @returns {string}
 */
function obterHorarioAtual() {
    return new Intl.DateTimeFormat(
        "pt-BR",
        {
            timeZone: "America/Sao_Paulo",
            hour: "2-digit",
            minute: "2-digit"
        }
    ).format(new Date());
}