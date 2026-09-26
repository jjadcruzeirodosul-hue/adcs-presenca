/**
 * ============================================================
 * ADCS Presença
 * admin-professores.js
 * ------------------------------------------------------------
 * Orquestrador do módulo administrativo de Gestão de Professores.
 *
 * Responsabilidades neste incremento:
 * - inicialização estrutural do módulo;
 * - coordenação da interface administrativa.
 *
 * Não realiza operações de leitura ou escrita no Firestore
 * neste incremento.
 *
 * Conforme DEVSTD-001.
 * ============================================================
 */

"use strict";

import {
    initAdminProfessoresUI
} from "./admin-professores-ui.js";

let moduloInicializado = false;

/**
 * Inicializa o módulo administrativo de professores.
 */
export function initAdminProfessores() {
    if (moduloInicializado) {
        return;
    }

    initAdminProfessoresUI();

    moduloInicializado = true;

    console.info(
        "[Admin][Professores] Módulo inicializado."
    );
}