/**
 * ============================================================
 * ADCS Presença
 * admin-professores-ui.js
 * ------------------------------------------------------------
 * Responsável exclusivamente pela interface da Gestão
 * Administrativa de Professores.
 *
 * Responsabilidades neste incremento:
 * - inicialização estrutural da interface;
 * - controle dos estados visuais básicos do módulo.
 *
 * Não conhece Firebase, Firestore, sessão ou Security Rules.
 *
 * Conforme DEVSTD-001.
 * ============================================================
 */

"use strict";

let moduloInicializado = false;

/**
 * Inicializa a interface administrativa de professores.
 */
export function initAdminProfessoresUI() {
    if (moduloInicializado) {
        return;
    }

    const elementos =
        obterElementos();

    ocultarLoading(elementos);
    ocultarLista(elementos);
    ocultarEditor(elementos);
    ocultarEstado(elementos);

    moduloInicializado = true;

    console.info(
        "[Admin][Professores][UI] Interface inicializada."
    );
}

/**
 * Obtém e valida os elementos estruturais do módulo.
 *
 * @returns {{
 *     estado: HTMLElement,
 *     loading: HTMLElement,
 *     lista: HTMLElement,
 *     editor: HTMLElement
 * }}
 */
function obterElementos() {
    const estado =
        document.getElementById(
            "estadoAdminProfessores"
        );

    const loading =
        document.getElementById(
            "loadingAdminProfessores"
        );

    const lista =
        document.getElementById(
            "listaAdminProfessores"
        );

    const editor =
        document.getElementById(
            "editorAdminProfessores"
        );

    if (!estado) {
        throw new Error(
            'O elemento "#estadoAdminProfessores" não foi encontrado.'
        );
    }

    if (!loading) {
        throw new Error(
            'O elemento "#loadingAdminProfessores" não foi encontrado.'
        );
    }

    if (!lista) {
        throw new Error(
            'O elemento "#listaAdminProfessores" não foi encontrado.'
        );
    }

    if (!editor) {
        throw new Error(
            'O elemento "#editorAdminProfessores" não foi encontrado.'
        );
    }

    return {
        estado,
        loading,
        lista,
        editor
    };
}

function ocultarEstado(elementos) {
    elementos.estado.hidden = true;
}

function ocultarLoading(elementos) {
    elementos.loading.hidden = true;
}

function ocultarLista(elementos) {
    elementos.lista.hidden = true;
}

function ocultarEditor(elementos) {
    elementos.editor.hidden = true;
}