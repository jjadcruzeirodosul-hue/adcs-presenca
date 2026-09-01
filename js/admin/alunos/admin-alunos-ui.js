/**
 * ============================================================
 * ADCS Presença
 * admin-alunos-ui.js
 * ------------------------------------------------------------
 * Responsável exclusivamente pela interface da Gestão
 * Administrativa de Alunos.
 *
 * Neste incremento estabelece somente os elementos estruturais
 * e o estado inicial do módulo.
 *
 * Não conhece Firebase, Firestore, sessão ou Security Rules.
 *
 * Conforme DEVSTD-001.
 * ============================================================
 */

"use strict";

let moduloInicializado = false;

/**
 * Inicializa os elementos estruturais da Gestão de Alunos.
 */
export function initAdminAlunosUI() {
    if (moduloInicializado) {
        return;
    }

    obterElementos();

    moduloInicializado = true;
}

/**
 * Apresenta o estado inicial da Gestão de Alunos.
 */
export function mostrarEstadoInicialAlunos() {
    const elementos = obterElementos();

    elementos.estado.textContent =
        "Gestão de Alunos pronta para carregamento.";

    elementos.estado.className =
        "feedback feedback--info";

    elementos.estado.hidden = false;
}

/**
 * Obtém e valida os elementos estruturais do módulo.
 *
 * @returns {{
 *     painel: HTMLElement,
 *     estado: HTMLElement,
 *     conteudo: HTMLElement
 * }}
 */
function obterElementos() {
    const painel =
        document.getElementById(
            "painelAdminAlunos"
        );

    const estado =
        document.getElementById(
            "estadoAdminAlunos"
        );

    const conteudo =
        document.getElementById(
            "conteudoAdminAlunos"
        );

    if (!painel) {
        throw new Error(
            'O painel "#painelAdminAlunos" não foi encontrado.'
        );
    }

    if (!estado) {
        throw new Error(
            'O estado "#estadoAdminAlunos" não foi encontrado.'
        );
    }

    if (!conteudo) {
        throw new Error(
            'O conteúdo "#conteudoAdminAlunos" não foi encontrado.'
        );
    }

    return {
        painel,
        estado,
        conteudo
    };
}