/**
 * ============================================================
 * ADCS Presença
 * login-ui.js
 * ------------------------------------------------------------
 * Responsável pela interação da interface de login.
 * Consome exclusivamente o auth-service.js.
 * Conforme DEVSTD-001.
 * ============================================================
 */

"use strict";

import {
    login
} from "./auth-service.js";

let autenticacaoEmAndamento = false;
let moduloInicializado = false;

/**
 * Inicializa o formulário de autenticação.
 */
export function initLoginUI() {
    if (moduloInicializado) {
        return;
    }

    const elementos = obterElementosLogin();

    elementos.form.addEventListener("submit", (evento) => {
        void processarLogin(evento, elementos);
    });

    ocultarLoadingLogin(elementos);
    ocultarMensagemLogin(elementos);

    moduloInicializado = true;
}

/**
 * Exibe o painel de login e oculta a aplicação operacional.
 */
export function mostrarPainelLogin() {
    const elementos = obterElementosVisibilidade();

    elementos.painelLogin.hidden = false;
    elementos.appOperacional.hidden = true;

    const campoEmail = document.getElementById("emailLogin");

    if (campoEmail instanceof HTMLInputElement) {
        campoEmail.focus();
    }
}

/**
 * Oculta o painel de login e exibe a aplicação operacional.
 */
export function mostrarAplicacaoOperacional() {
    const elementos = obterElementosVisibilidade();

    elementos.painelLogin.hidden = true;
    elementos.appOperacional.hidden = false;
}

/**
 * Exibe uma mensagem pública no painel de login.
 *
 * Utilizada pelo Bootstrap para comunicar bloqueios de acesso
 * após a resolução da sessão e do RBAC.
 *
 * @param {string} texto
 * @param {"error" | "warning" | "info" | "success"} tipo
 */
export function mostrarMensagemPainelLogin(
    texto,
    tipo = "info"
) {
    const elementos = obterElementosLogin();

    mostrarMensagemLogin(
        elementos,
        texto,
        tipo
    );
}

/**
 * Limpa mensagens anteriormente apresentadas no painel.
 */
export function limparMensagemPainelLogin() {
    const elementos = obterElementosLogin();

    ocultarMensagemLogin(elementos);
}

/**
 * Processa o envio do formulário de login.
 *
 * @param {SubmitEvent} evento
 * @param {{
 *     form: HTMLFormElement,
 *     inputEmail: HTMLInputElement,
 *     inputSenha: HTMLInputElement,
 *     botaoEntrar: HTMLButtonElement,
 *     loading: HTMLElement,
 *     mensagem: HTMLElement
 * }} elementos
 *
 * @returns {Promise<void>}
 */
async function processarLogin(evento, elementos) {
    evento.preventDefault();

    if (autenticacaoEmAndamento) {
        return;
    }

    ocultarMensagemLogin(elementos);

    const email = elementos.inputEmail.value.trim();
    const senha = elementos.inputSenha.value;

    if (!email) {
        mostrarMensagemLogin(
            elementos,
            "Informe o e-mail.",
            "warning"
        );

        elementos.inputEmail.focus();

        return;
    }

    if (!senha) {
        mostrarMensagemLogin(
            elementos,
            "Informe a senha.",
            "warning"
        );

        elementos.inputSenha.focus();

        return;
    }

    iniciarAutenticacao(elementos);

    try {
        await login(email, senha);

        elementos.inputSenha.value = "";

        console.info(
            "[Login] Autenticação realizada com sucesso."
        );
    } catch (erro) {
        console.error(
            "[Login] Falha na autenticação:",
            erro
        );

        mostrarMensagemLogin(
            elementos,
            obterMensagemErroAutenticacao(erro),
            "error"
        );

        elementos.inputSenha.value = "";
        elementos.inputSenha.focus();
    } finally {
        finalizarAutenticacao(elementos);
    }
}

/**
 * Ativa o estado de processamento do login.
 *
 * @param {ReturnType<typeof obterElementosLogin>} elementos
 */
function iniciarAutenticacao(elementos) {
    autenticacaoEmAndamento = true;

    elementos.botaoEntrar.disabled = true;
    elementos.botaoEntrar.setAttribute(
        "aria-busy",
        "true"
    );

    elementos.inputEmail.disabled = true;
    elementos.inputSenha.disabled = true;

    mostrarLoadingLogin(elementos);
}

/**
 * Finaliza o estado de processamento do login.
 *
 * @param {ReturnType<typeof obterElementosLogin>} elementos
 */
function finalizarAutenticacao(elementos) {
    ocultarLoadingLogin(elementos);

    elementos.botaoEntrar.disabled = false;
    elementos.botaoEntrar.removeAttribute("aria-busy");

    elementos.inputEmail.disabled = false;
    elementos.inputSenha.disabled = false;

    autenticacaoEmAndamento = false;
}

/**
 * Exibe o indicador de autenticação.
 *
 * @param {ReturnType<typeof obterElementosLogin>} elementos
 */
function mostrarLoadingLogin(elementos) {
    elementos.loading.hidden = false;
}

/**
 * Oculta o indicador de autenticação.
 *
 * @param {ReturnType<typeof obterElementosLogin>} elementos
 */
function ocultarLoadingLogin(elementos) {
    elementos.loading.hidden = true;
}

/**
 * Exibe uma mensagem no painel de login.
 *
 * @param {ReturnType<typeof obterElementosLogin>} elementos
 * @param {string} texto
 * @param {"error" | "warning" | "info" | "success"} tipo
 */
function mostrarMensagemLogin(
    elementos,
    texto,
    tipo
) {
    elementos.mensagem.textContent = texto;
    elementos.mensagem.className =
        `feedback feedback--${tipo}`;
    elementos.mensagem.hidden = false;
}

/**
 * Limpa a mensagem do painel de login.
 *
 * @param {ReturnType<typeof obterElementosLogin>} elementos
 */
function ocultarMensagemLogin(elementos) {
    elementos.mensagem.textContent = "";
    elementos.mensagem.className = "feedback";
    elementos.mensagem.hidden = true;
}

/**
 * Traduz falhas conhecidas de autenticação para mensagens
 * amigáveis ao usuário.
 *
 * @param {unknown} erro
 * @returns {string}
 */
function obterMensagemErroAutenticacao(erro) {
    const codigo =
        erro &&
        typeof erro === "object" &&
        typeof erro.code === "string"
            ? erro.code
            : "";

    if (
        codigo === "auth/invalid-credential" ||
        codigo === "auth/wrong-password" ||
        codigo === "auth/user-not-found"
    ) {
        return "E-mail ou senha inválidos.";
    }

    if (codigo === "auth/invalid-email") {
        return "Informe um endereço de e-mail válido.";
    }

    if (codigo === "auth/too-many-requests") {
        return (
            "Muitas tentativas foram realizadas. " +
            "Aguarde alguns minutos e tente novamente."
        );
    }

    if (codigo === "auth/network-request-failed") {
        return (
            "Não foi possível conectar ao serviço de autenticação. " +
            "Verifique sua conexão."
        );
    }

    return (
        "Não foi possível realizar o login. " +
        "Verifique os dados informados e tente novamente."
    );
}

/**
 * Obtém e valida os elementos do formulário de login.
 *
 * @returns {{
 *     form: HTMLFormElement,
 *     inputEmail: HTMLInputElement,
 *     inputSenha: HTMLInputElement,
 *     botaoEntrar: HTMLButtonElement,
 *     loading: HTMLElement,
 *     mensagem: HTMLElement
 * }}
 */
function obterElementosLogin() {
    const form = document.getElementById("formLogin");
    const inputEmail = document.getElementById("emailLogin");
    const inputSenha = document.getElementById("senhaLogin");
    const botaoEntrar = document.getElementById("btnEntrar");
    const loading = document.getElementById("loadingLogin");
    const mensagem = document.getElementById("mensagemLogin");

    if (!(form instanceof HTMLFormElement)) {
        throw new Error(
            'O formulário "#formLogin" não foi encontrado.'
        );
    }

    if (!(inputEmail instanceof HTMLInputElement)) {
        throw new Error(
            'O campo "#emailLogin" não foi encontrado.'
        );
    }

    if (!(inputSenha instanceof HTMLInputElement)) {
        throw new Error(
            'O campo "#senhaLogin" não foi encontrado.'
        );
    }

    if (!(botaoEntrar instanceof HTMLButtonElement)) {
        throw new Error(
            'O botão "#btnEntrar" não foi encontrado.'
        );
    }

    if (!loading) {
        throw new Error(
            'O indicador "#loadingLogin" não foi encontrado.'
        );
    }

    if (!mensagem) {
        throw new Error(
            'A mensagem "#mensagemLogin" não foi encontrada.'
        );
    }

    return {
        form,
        inputEmail,
        inputSenha,
        botaoEntrar,
        loading,
        mensagem
    };
}

/**
 * Obtém os painéis principais da aplicação.
 *
 * @returns {{
 *     painelLogin: HTMLElement,
 *     appOperacional: HTMLElement
 * }}
 */
function obterElementosVisibilidade() {
    const painelLogin = document.getElementById("painelLogin");
    const appOperacional = document.getElementById(
        "appOperacional"
    );

    if (!painelLogin) {
        throw new Error(
            'O painel "#painelLogin" não foi encontrado.'
        );
    }

    if (!appOperacional) {
        throw new Error(
            'A aplicação "#appOperacional" não foi encontrada.'
        );
    }

    return {
        painelLogin,
        appOperacional
    };
}