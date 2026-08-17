/**
 * ============================================================
 * ADCS Presença
 * admin-navigation.js
 * ------------------------------------------------------------
 * Responsável exclusivamente pela navegação entre os módulos
 * estruturais do Painel Administrativo.
 *
 * Não conhece Firebase, sessão, RBAC ou regras de negócio.
 *
 * S4-RF-010 — Navegação administrativa consistente.
 * S4-RF-015 — Identificação perceptível da área ativa.
 * Conforme DEVSTD-001.
 * ============================================================
 */

"use strict";

const MODULOS_ADMINISTRATIVOS = {
    usuarios: {
        botaoId: "btnAdminUsuarios",
        painelId: "painelAdminUsuarios"
    },

    alunos: {
        botaoId: "btnAdminAlunos",
        painelId: "painelAdminAlunos"
    },

    professores: {
        botaoId: "btnAdminProfessores",
        painelId: "painelAdminProfessores"
    }
};

let moduloInicializado = false;

/**
 * Inicializa a navegação estrutural do Painel Administrativo.
 */
export function initAdminNavigation() {
    if (moduloInicializado) {
        return;
    }

    Object.entries(
        MODULOS_ADMINISTRATIVOS
    ).forEach(([modulo, configuracao]) => {
        const botao = obterBotao(configuracao.botaoId);

        botao.addEventListener("click", () => {
            selecionarModuloAdministrativo(modulo);
        });
    });

    selecionarModuloAdministrativo("usuarios");

    moduloInicializado = true;
}

/**
 * Seleciona um módulo estrutural do Painel Administrativo.
 *
 * Nesta entrega os módulos são apenas pontos de extensão.
 * Nenhuma regra de negócio é executada.
 *
 * @param {"usuarios" | "alunos" | "professores"} modulo
 */
export function selecionarModuloAdministrativo(modulo) {
    if (!Object.hasOwn(
        MODULOS_ADMINISTRATIVOS,
        modulo
    )) {
        console.warn(
            "[Admin] Módulo administrativo desconhecido.",
            { modulo }
        );

        return;
    }

    Object.entries(
        MODULOS_ADMINISTRATIVOS
    ).forEach(([chave, configuracao]) => {
        const ativo = chave === modulo;

        const botao = obterBotao(
            configuracao.botaoId
        );

        const painel = obterPainel(
            configuracao.painelId
        );

        botao.setAttribute(
            "aria-pressed",
            String(ativo)
        );

        botao.classList.toggle(
            "admin-navigation__button--active",
            ativo
        );

        painel.hidden = !ativo;
    });

    console.info(
        "[Admin] Módulo estrutural selecionado.",
        { modulo }
    );
}

/**
 * Obtém e valida um botão administrativo.
 *
 * @param {string} id
 * @returns {HTMLButtonElement}
 */
function obterBotao(id) {
    const elemento = document.getElementById(id);

    if (!(elemento instanceof HTMLButtonElement)) {
        throw new Error(
            `O botão administrativo "#${id}" não foi encontrado.`
        );
    }

    return elemento;
}

/**
 * Obtém e valida um painel administrativo.
 *
 * @param {string} id
 * @returns {HTMLElement}
 */
function obterPainel(id) {
    const elemento = document.getElementById(id);

    if (!elemento) {
        throw new Error(
            `O painel administrativo "#${id}" não foi encontrado.`
        );
    }

    return elemento;
}
