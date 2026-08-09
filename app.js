/**
 * ============================================================
 * ADCS Presença
 * app.js
 * ------------------------------------------------------------
 * Bootstrap principal da aplicação.
 * Responsável por coordenar autenticação, autorização e
 * inicialização dos módulos operacionais.
 * Conforme DEVSTD-001.
 * ============================================================
 */

"use strict";

import {
    inicializarSessao
} from "./js/auth/session.js";

import {
    possuiAcessoOperacional,
    possuiUsuarioValido,
    usuarioEstaAtivo
} from "./js/auth/access-control.js";

import {
    initLoginUI,
    limparMensagemPainelLogin,
    mostrarAplicacaoOperacional,
    mostrarMensagemPainelLogin,
    mostrarPainelLogin
} from "./js/auth/login-ui.js";

import {
    initUI,
    mostrarMensagem
} from "./js/ui.js";

import {
    carregarProfessores
} from "./js/professor.js";

import {
    initRegistroManual
} from "./js/manual.js";

import {
    initScanner
} from "./js/scanner.js";

let bootstrapInicializado = false;
let modulosOperacionaisInicializados = false;

/**
 * Inicializa o Bootstrap protegido.
 */
function iniciarAplicacao() {
    if (bootstrapInicializado) {
        return;
    }

    bootstrapInicializado = true;

    try {
        initLoginUI();
        mostrarPainelLogin();

        inicializarSessao((sessao) => {
            void processarEstadoSessao(sessao);
        });

        console.info(
            "[App] Aguardando resolução da sessão de autenticação."
        );
    } catch (erro) {
        tratarErroInicializacao(erro);
    }
}

/**
 * Processa o estado resolvido da sessão e aplica o RBAC antes
 * da inicialização dos módulos operacionais.
 *
 * @param {{
 *     usuarioAutenticado: Object | null,
 *     usuarioSistema: Object | null
 * }} sessao
 *
 * @returns {Promise<void>}
 */
async function processarEstadoSessao(sessao) {
    try {
        if (!sessao.usuarioAutenticado) {
            tratarSessaoNaoAutenticada();
            return;
        }

        if (
            !sessao.usuarioSistema ||
            !possuiUsuarioValido()
        ) {
            tratarUsuarioSistemaAusente(
                sessao.usuarioAutenticado
            );

            return;
        }

        if (!usuarioEstaAtivo()) {
            tratarUsuarioInativo(
                sessao.usuarioAutenticado
            );

            return;
        }

        if (!possuiAcessoOperacional()) {
            tratarUsuarioNaoAutorizado(
                sessao.usuarioAutenticado
            );

            return;
        }

        limparMensagemPainelLogin();
        mostrarAplicacaoOperacional();

        await inicializarModulosOperacionais();

        console.info(
            "[App] Sessão autenticada e acesso operacional autorizado.",
            {
                uid: sessao.usuarioAutenticado.uid
            }
        );
    } catch (erro) {
        tratarErroInicializacao(erro);
    }
}

/**
 * Inicializa os módulos funcionais somente após autenticação
 * e autorização válidas.
 *
 * @returns {Promise<void>}
 */
async function inicializarModulosOperacionais() {
    if (modulosOperacionaisInicializados) {
        return;
    }

    initUI();

    await carregarProfessores();

    initRegistroManual();
    initScanner();

    modulosOperacionaisInicializados = true;

    console.info(
        "[App] Módulos operacionais inicializados com sucesso."
    );
}

/**
 * Trata o cenário sem sessão autenticada.
 */
function tratarSessaoNaoAutenticada() {
    mostrarPainelLogin();

    mostrarMensagemPainelLogin(
        "Informe seu e-mail e senha para acessar o ADCS Presença.",
        "info"
    );

    console.info(
        "[App] Nenhum usuário autenticado."
    );
}

/**
 * Trata o cenário de usuário autenticado sem documento
 * correspondente em usuarios/{uid}.
 *
 * @param {{uid?: string}} usuarioAutenticado
 */
function tratarUsuarioSistemaAusente(usuarioAutenticado) {
    mostrarPainelLogin();

    mostrarMensagemPainelLogin(
        "Seu usuário está autenticado, mas não possui cadastro de acesso ao ADCS Presença.",
        "error"
    );

    console.warn(
        "[App] Documento do usuário não localizado.",
        {
            uid: usuarioAutenticado?.uid || "não informado"
        }
    );
}

/**
 * Trata o cenário de usuário operacionalmente inativo.
 *
 * @param {{uid?: string}} usuarioAutenticado
 */
function tratarUsuarioInativo(usuarioAutenticado) {
    mostrarPainelLogin();

    mostrarMensagemPainelLogin(
        "Seu acesso ao ADCS Presença está inativo. Procure um administrador.",
        "warning"
    );

    console.warn(
        "[App] Usuário operacionalmente inativo.",
        {
            uid: usuarioAutenticado?.uid || "não informado"
        }
    );
}

/**
 * Trata o cenário de usuário sem perfil operacional.
 *
 * @param {{uid?: string}} usuarioAutenticado
 */
function tratarUsuarioNaoAutorizado(usuarioAutenticado) {
    mostrarPainelLogin();

    mostrarMensagemPainelLogin(
        "Você não possui permissão para acessar o módulo de registro de presença.",
        "error"
    );

    console.warn(
        "[App] Usuário sem perfil operacional autorizado.",
        {
            uid: usuarioAutenticado?.uid || "não informado"
        }
    );
}

/**
 * Centraliza falhas inesperadas do Bootstrap.
 *
 * @param {unknown} erro
 */
function tratarErroInicializacao(erro) {
    console.error(
        "[App] Erro ao inicializar o ADCS Presença:",
        erro
    );

    try {
        mostrarPainelLogin();

        mostrarMensagemPainelLogin(
            "Não foi possível inicializar a aplicação. Atualize a página e tente novamente.",
            "error"
        );
    } catch {
        mostrarMensagem(
            "Não foi possível inicializar a aplicação. Atualize a página e tente novamente.",
            "error"
        );
    }
}

/**
 * Inicializa imediatamente quando o DOM já está disponível.
 * Caso contrário, aguarda o DOMContentLoaded.
 */
if (document.readyState === "loading") {
    document.addEventListener(
        "DOMContentLoaded",
        iniciarAplicacao,
        { once: true }
    );
} else {
    iniciarAplicacao();
}