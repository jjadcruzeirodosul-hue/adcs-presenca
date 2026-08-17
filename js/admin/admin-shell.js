/**
 * ============================================================
 * ADCS Presença
 * admin-shell.js
 * ------------------------------------------------------------
 * Responsável pela fundação do contexto administrativo e pela
 * navegação entre Operação e Administração.
 *
 * A autorização é consultada antes de qualquer entrada no
 * contexto administrativo.
 *
 * Não conhece Firebase nem Firestore.
 *
 * S4-RN-005 — Painel integrado à aplicação.
 * S4-RN-006 — Acesso administrativo exclusivo do ADMIN.
 * Conforme DEVSTD-001.
 * ============================================================
 */

"use strict";

import {
    podeAcessarAdministracao
} from "./admin-access.js";

import {
    initAdminNavigation,
    selecionarModuloAdministrativo
} from "./admin-navigation.js";

let moduloInicializado = false;
let callbackAntesAdministracao = null;

/**
 * Inicializa a fundação administrativa.
 *
 * @param {{
 *     onAntesEntrarAdministracao?: () => Promise<void> | void
 * }} opcoes
 */
export function initAdminShell(
    {
        onAntesEntrarAdministracao = null
    } = {}
) {
    if (moduloInicializado) {
        return;
    }

    callbackAntesAdministracao =
        typeof onAntesEntrarAdministracao === "function"
            ? onAntesEntrarAdministracao
            : null;

    const elementos = obterElementos();

    elementos.btnOperacao.addEventListener(
        "click",
        () => {
            mostrarAreaOperacional();
        }
    );

    elementos.btnAdministracao.addEventListener(
        "click",
        () => {
            void solicitarAreaAdministrativa();
        }
    );

    initAdminNavigation();

    resetAdminShell();

    moduloInicializado = true;
}

/**
 * Atualiza a disponibilidade visual da Administração segundo
 * o RBAC da sessão atualmente resolvida.
 */
export function atualizarAcessoAdministrativo() {
    const elementos = obterElementos();

    const autorizado =
        podeAcessarAdministracao();

    elementos.btnAdministracao.hidden =
        !autorizado;

    if (!autorizado) {
        mostrarAreaOperacional();
    }

    console.info(
        "[Admin] Acesso administrativo avaliado.",
        {
            autorizado
        }
    );
}

/**
 * Retorna o shell para seu estado seguro inicial.
 *
 * Utilizado quando a sessão deixa de estar autorizada.
 */
export function resetAdminShell() {
    const elementos = obterElementos();

    elementos.btnAdministracao.hidden = true;

    mostrarAreaOperacional();

    selecionarModuloAdministrativo("usuarios");
}

/**
 * Exibe a área operacional.
 */
function mostrarAreaOperacional() {
    const elementos = obterElementos();

    elementos.areaOperacional.hidden = false;
    elementos.areaAdministrativa.hidden = true;

    atualizarEstadoNavegacaoPrincipal({
        operacaoAtiva: true
    });
}

/**
 * Solicita entrada no contexto administrativo.
 *
 * A autorização é obrigatoriamente reavaliada neste ponto.
 *
 * @returns {Promise<void>}
 */
async function solicitarAreaAdministrativa() {
    if (!podeAcessarAdministracao()) {
		console.warn(
			"[Admin] Tentativa de acesso administrativo bloqueada por RBAC."
		);

		atualizarAcessoAdministrativo();

		return;
	}

    try {
        if (callbackAntesAdministracao) {
            await callbackAntesAdministracao();
        }

        const elementos = obterElementos();

        selecionarModuloAdministrativo(
            "usuarios"
        );

        elementos.areaOperacional.hidden = true;
        elementos.areaAdministrativa.hidden = false;

        atualizarEstadoNavegacaoPrincipal({
            operacaoAtiva: false
        });

        console.info(
            "[Admin] Contexto administrativo inicializado com autorização válida."
        );
    } catch (erro) {
        console.error(
            "[Admin] Não foi possível abrir o contexto administrativo:",
            erro
        );

        mostrarAreaOperacional();
    }
}

/**
 * Atualiza a indicação visual e semântica da área principal.
 *
 * @param {{operacaoAtiva: boolean}} estado
 */
function atualizarEstadoNavegacaoPrincipal({
    operacaoAtiva
}) {
    const elementos = obterElementos();

    elementos.btnOperacao.setAttribute(
        "aria-pressed",
        String(operacaoAtiva)
    );

    elementos.btnAdministracao.setAttribute(
        "aria-pressed",
        String(!operacaoAtiva)
    );

    elementos.btnOperacao.classList.toggle(
        "app-navigation__button--active",
        operacaoAtiva
    );

    elementos.btnAdministracao.classList.toggle(
        "app-navigation__button--active",
        !operacaoAtiva
    );
}

/**
 * Obtém e valida os elementos estruturais da aplicação.
 *
 * @returns {{
 *     btnOperacao: HTMLButtonElement,
 *     btnAdministracao: HTMLButtonElement,
 *     areaOperacional: HTMLElement,
 *     areaAdministrativa: HTMLElement
 * }}
 */
function obterElementos() {
    const btnOperacao =
        document.getElementById(
            "btnAreaOperacional"
        );

    const btnAdministracao =
        document.getElementById(
            "btnAreaAdministrativa"
        );

    const areaOperacional =
        document.getElementById(
            "areaOperacional"
        );

    const areaAdministrativa =
        document.getElementById(
            "areaAdministrativa"
        );

    if (!(btnOperacao instanceof HTMLButtonElement)) {
        throw new Error(
            'O botão "#btnAreaOperacional" não foi encontrado.'
        );
    }

    if (!(btnAdministracao instanceof HTMLButtonElement)) {
        throw new Error(
            'O botão "#btnAreaAdministrativa" não foi encontrado.'
        );
    }

    if (!areaOperacional) {
        throw new Error(
            'A área "#areaOperacional" não foi encontrada.'
        );
    }

    if (!areaAdministrativa) {
        throw new Error(
            'A área "#areaAdministrativa" não foi encontrada.'
        );
    }

    return {
        btnOperacao,
        btnAdministracao,
        areaOperacional,
        areaAdministrativa
    };
}
