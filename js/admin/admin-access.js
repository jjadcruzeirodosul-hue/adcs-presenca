/**
 * ============================================================
 * ADCS Presença
 * admin-access.js
 * ------------------------------------------------------------
 * Fachada de autorização do contexto administrativo.
 *
 * Não redefine regras de RBAC.
 * Delega a decisão de acesso ao controle central existente
 * em auth/access-control.js.
 *
 * S4-RN-006 — Acesso administrativo exclusivo do ADMIN.
 * Conforme DEVSTD-001.
 * ============================================================
 */

"use strict";

import {
    ehAdmin
} from "../auth/access-control.js";

/**
 * Informa se a sessão atual possui autorização para acessar
 * o contexto administrativo.
 *
 * A decisão permanece centralizada no RBAC existente.
 *
 * @returns {boolean}
 */
export function podeAcessarAdministracao() {
    return ehAdmin();
}
