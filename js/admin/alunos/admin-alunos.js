/**
 * ============================================================
 * ADCS Presença
 * admin-alunos.js
 * ------------------------------------------------------------
 * Orquestrador do módulo administrativo de Gestão de Alunos.
 *
 * Neste incremento estabelece somente a fundação estrutural
 * do módulo.
 *
 * Não realiza leitura ou persistência no Firestore.
 *
 * Conforme DEVSTD-001.
 * ============================================================
 */

"use strict";

import {
    initAdminAlunosUI,
    mostrarEstadoInicialAlunos
} from "./admin-alunos-ui.js";

let moduloInicializado = false;

/**
 * Inicializa a fundação do módulo administrativo de alunos.
 */
export function initAdminAlunos() {
    if (moduloInicializado) {
        return;
    }

    initAdminAlunosUI();
    mostrarEstadoInicialAlunos();

    moduloInicializado = true;

    console.info(
        "[Admin][Alunos] Fundação do módulo inicializada."
    );
}