/**
 * ============================================================
 * ADCS Presença
 * activity-monitor.js
 * ------------------------------------------------------------
 * Responsável pelo monitoramento de inatividade da sessão.
 *
 * Não conhece Firebase, RBAC ou regras de negócio.
 * Apenas observa atividade do usuário, controla timers e
 * dispara callbacks configurados pelo Bootstrap.
 * Conforme DEVSTD-001.
 * ============================================================
 */

"use strict";

import {
    sessionConfig
} from "../config/session-config.js";

const EVENTOS_ATIVIDADE = [
    "pointerdown",
    "keydown"
];

let monitorAtivo = false;
let avisoExibido = false;

let timeoutAviso = null;
let timeoutLogout = null;

let callbackAviso = null;
let callbackLogout = null;
let callbackAtividade = null;

/**
 * Inicializa o monitor de inatividade.
 *
 * @param {{
 *     onAviso?: function,
 *     onLogout?: function,
 *     onAtividade?: function
 * }} callbacks
 */
export function iniciarMonitorInatividade(callbacks = {}) {
    if (monitorAtivo) {
        return;
    }

    callbackAviso =
        typeof callbacks.onAviso === "function"
            ? callbacks.onAviso
            : null;

    callbackLogout =
        typeof callbacks.onLogout === "function"
            ? callbacks.onLogout
            : null;

    callbackAtividade =
        typeof callbacks.onAtividade === "function"
            ? callbacks.onAtividade
            : null;

    registrarListeners();

    monitorAtivo = true;

    reiniciarTemporizadores();

    console.info(
        "[Sessão] Monitor de inatividade iniciado.",
        {
            avisoMs:
                sessionConfig.avisoInatividadeMs,
            logoutMs:
                sessionConfig.logoutInatividadeMs
        }
    );
}

/**
 * Encerra completamente o monitor de inatividade.
 */
export function encerrarMonitorInatividade() {
    if (!monitorAtivo) {
        limparTemporizadores();
        limparCallbacks();

        return;
    }

    removerListeners();
    limparTemporizadores();
    limparCallbacks();

    monitorAtivo = false;
    avisoExibido = false;

    console.info(
        "[Sessão] Monitor de inatividade encerrado."
    );
}

/**
 * Reinicia os temporizadores da sessão.
 *
 * Pode ser chamada externamente quando houver uma atividade
 * válida que não passe pelos eventos globais observados.
 */
export function registrarAtividade() {
    if (!monitorAtivo) {
        return;
    }

    processarAtividade();
}

/**
 * Processa uma atividade válida do usuário.
 */
function processarAtividade() {
    const avisoEstavaExibido = avisoExibido;

    avisoExibido = false;

    reiniciarTemporizadores();

    if (callbackAtividade) {
        callbackAtividade({
            avisoEstavaExibido
        });
    }
}

/**
 * Reinicia os timers de aviso e logout.
 */
function reiniciarTemporizadores() {
    limparTemporizadores();

    timeoutAviso = window.setTimeout(
        dispararAvisoInatividade,
        sessionConfig.avisoInatividadeMs
    );

    timeoutLogout = window.setTimeout(
        dispararLogoutInatividade,
        sessionConfig.logoutInatividadeMs
    );
}

/**
 * Dispara o aviso de inatividade.
 */
function dispararAvisoInatividade() {
    if (!monitorAtivo) {
        return;
    }

    avisoExibido = true;

    console.info(
        "[Sessão] Limite de aviso de inatividade atingido."
    );

    if (callbackAviso) {
        callbackAviso({
            avisoInatividadeMs:
                sessionConfig.avisoInatividadeMs,
            logoutInatividadeMs:
                sessionConfig.logoutInatividadeMs,
            tempoRestanteMs:
                sessionConfig.logoutInatividadeMs -
                sessionConfig.avisoInatividadeMs
        });
    }
}

/**
 * Dispara a solicitação de logout por inatividade.
 */
function dispararLogoutInatividade() {
    if (!monitorAtivo) {
        return;
    }

    console.info(
        "[Sessão] Limite máximo de inatividade atingido."
    );

    if (callbackLogout) {
        callbackLogout({
            motivo: "INATIVIDADE"
        });
    }
}

/**
 * Listener central de atividade.
 */
function tratarEventoAtividade() {
    if (!monitorAtivo) {
        return;
    }

    processarAtividade();
}

/**
 * Registra os listeners globais.
 */
function registrarListeners() {
    EVENTOS_ATIVIDADE.forEach((evento) => {
        window.addEventListener(
            evento,
            tratarEventoAtividade,
            {
                passive: true
            }
        );
    });
}

/**
 * Remove os listeners globais.
 */
function removerListeners() {
    EVENTOS_ATIVIDADE.forEach((evento) => {
        window.removeEventListener(
            evento,
            tratarEventoAtividade
        );
    });
}

/**
 * Limpa timers ativos.
 */
function limparTemporizadores() {
    if (timeoutAviso !== null) {
        window.clearTimeout(timeoutAviso);
        timeoutAviso = null;
    }

    if (timeoutLogout !== null) {
        window.clearTimeout(timeoutLogout);
        timeoutLogout = null;
    }
}

/**
 * Limpa callbacks mantidos em memória.
 */
function limparCallbacks() {
    callbackAviso = null;
    callbackLogout = null;
    callbackAtividade = null;
}
