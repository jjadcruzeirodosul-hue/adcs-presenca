/**
 * ============================================================
 * ADCS Presença
 * session-config.js
 * ------------------------------------------------------------
 * Configuração dos tempos de inatividade da sessão por ambiente.
 *
 * PROD:
 * - aviso após 25 minutos de inatividade;
 * - logout automático após 30 minutos.
 *
 * DEV e QA utilizam tempos reduzidos exclusivamente para
 * facilitar testes e homologação.
 * ============================================================
 */

"use strict";

const MINUTO_EM_MS = 60 * 1000;

const SESSION_CONFIG_BY_HOSTNAME = {
    "localhost": {
        avisoInatividadeMs: 1 * MINUTO_EM_MS,
        logoutInatividadeMs: 2 * MINUTO_EM_MS
    },

    "127.0.0.1": {
        avisoInatividadeMs: 1 * MINUTO_EM_MS,
        logoutInatividadeMs: 2 * MINUTO_EM_MS
    },

    "adcs-presenca-dev.web.app": {
        avisoInatividadeMs: 1 * MINUTO_EM_MS,
        logoutInatividadeMs: 2 * MINUTO_EM_MS
    },

    "adcs-presenca-dev.firebaseapp.com": {
        avisoInatividadeMs: 1 * MINUTO_EM_MS,
        logoutInatividadeMs: 2 * MINUTO_EM_MS
    },

    "adcs-presenca-qa.web.app": {
        avisoInatividadeMs: 2 * MINUTO_EM_MS,
        logoutInatividadeMs: 3 * MINUTO_EM_MS
    },

    "adcs-presenca-qa.firebaseapp.com": {
        avisoInatividadeMs: 2 * MINUTO_EM_MS,
        logoutInatividadeMs: 3 * MINUTO_EM_MS
    },

    "adcs-presenca-jiu-jitsu.web.app": {
        avisoInatividadeMs: 25 * MINUTO_EM_MS,
        logoutInatividadeMs: 30 * MINUTO_EM_MS
    },

    "adcs-presenca-jiu-jitsu.firebaseapp.com": {
        avisoInatividadeMs: 25 * MINUTO_EM_MS,
        logoutInatividadeMs: 30 * MINUTO_EM_MS
    }
};

const hostname = window.location.hostname;

const sessionConfig = SESSION_CONFIG_BY_HOSTNAME[hostname];

if (!sessionConfig) {
    throw new Error(
        `[Sessão] Ambiente não reconhecido para o hostname: ${hostname}`
    );
}

if (
    sessionConfig.avisoInatividadeMs >=
    sessionConfig.logoutInatividadeMs
) {
    throw new Error(
        "[Sessão] O tempo de aviso deve ser menor que o tempo de logout."
    );
}

export {
    sessionConfig
};