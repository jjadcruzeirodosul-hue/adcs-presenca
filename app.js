/**
 * ============================================================
 * ADCS Presença
 * app.js
 * ------------------------------------------------------------
 * Bootstrap principal da aplicação.
 * Responsável por coordenar autenticação, autorização,
 * sessão, inatividade e inicialização dos módulos operacionais.
 * Conforme DEVSTD-001.
 * ============================================================
 */

"use strict";

import {
    inicializarSessao
} from "./js/auth/session.js";

import {
    logout
} from "./js/auth/auth-service.js";

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
    definirLogoutEmAndamento,
    initSessionUI,
    limparUsuarioSessao,
    mostrarAvisoInatividade,
    mostrarUsuarioSessao,
    ocultarAvisoInatividade
} from "./js/auth/session-ui.js";

import {
    encerrarMonitorInatividade,
    iniciarMonitorInatividade
} from "./js/auth/activity-monitor.js";

import {
    initUI,
    limparFeedback,
    mostrarMensagem
} from "./js/ui.js";

import {
    carregarProfessores
} from "./js/professor.js";

import {
    initRegistroManual
} from "./js/manual.js";

import {
    initScanner,
    pararScanner
} from "./js/scanner.js";

let bootstrapInicializado = false;
let modulosOperacionaisInicializados = false;
let logoutEmAndamento = false;

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

        initSessionUI({
            onLogout: () => {
                void executarLogoutManual();
            }
        });

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

        mostrarUsuarioSessao({
            email:
                sessao.usuarioAutenticado.email || "",
            perfis:
                Array.isArray(sessao.usuarioSistema.perfis)
                    ? sessao.usuarioSistema.perfis
                    : []
        });

        definirLogoutEmAndamento(false);
        mostrarAplicacaoOperacional();

        await inicializarModulosOperacionais();

        iniciarControleInatividade();

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
 * Inicializa o monitor de inatividade da sessão.
 */
function iniciarControleInatividade() {
    encerrarMonitorInatividade();

    ocultarAvisoInatividade();

    iniciarMonitorInatividade({
        onAviso: ({ tempoRestanteMs }) => {
            mostrarAvisoInatividade(
                tempoRestanteMs
            );
        },

        onAtividade: ({ avisoEstavaExibido }) => {
            if (avisoEstavaExibido) {
                ocultarAvisoInatividade();

                console.info(
                    "[Sessão] Atividade detectada após aviso. Temporizadores reiniciados."
                );
            }
        },

        onLogout: () => {
            void executarLogoutInatividade();
        }
    });
}

/**
 * Encerra monitor e recursos associados à sessão.
 */
function encerrarControleSessao() {
    encerrarMonitorInatividade();
    ocultarAvisoInatividade();
}

/**
 * Executa o logout solicitado manualmente pelo usuário.
 *
 * @returns {Promise<void>}
 */
async function executarLogoutManual() {
    if (logoutEmAndamento) {
        return;
    }

    logoutEmAndamento = true;
    definirLogoutEmAndamento(true);

    try {
        encerrarControleSessao();

        await pararScanner();

        limparFeedback();

        await logout();

        console.info(
            "[Sessão] Logout manual realizado com sucesso."
        );
    } catch (erro) {
        console.error(
            "[Sessão] Não foi possível realizar o logout:",
            erro
        );

        mostrarMensagem(
            "Não foi possível encerrar sua sessão. Tente novamente.",
            "error"
        );
    } finally {
        logoutEmAndamento = false;
        definirLogoutEmAndamento(false);
    }
}

/**
 * Executa logout automático por inatividade.
 *
 * @returns {Promise<void>}
 */
async function executarLogoutInatividade() {
    if (logoutEmAndamento) {
        return;
    }

    logoutEmAndamento = true;

    try {
        encerrarControleSessao();

        await pararScanner();

        limparFeedback();

        await logout();

        console.info(
            "[Sessão] Logout automático por inatividade realizado com sucesso."
        );
    } catch (erro) {
        console.error(
            "[Sessão] Falha ao executar logout automático por inatividade:",
            erro
        );

        mostrarMensagem(
            "Não foi possível encerrar automaticamente sua sessão.",
            "error"
        );
    } finally {
        logoutEmAndamento = false;
    }
}

/**
 * Trata o cenário sem sessão autenticada.
 */
function tratarSessaoNaoAutenticada() {
    encerrarControleSessao();

    limparUsuarioSessao();
    definirLogoutEmAndamento(false);
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
    encerrarControleSessao();

    limparUsuarioSessao();
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
    encerrarControleSessao();

    limparUsuarioSessao();
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
    encerrarControleSessao();

    limparUsuarioSessao();
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
        encerrarControleSessao();
        limparUsuarioSessao();
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
