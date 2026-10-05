/**
 * ============================================================
 * ADCS Presença
 * session-ui.js
 * ------------------------------------------------------------
 * Responsável pela interface relacionada à sessão autenticada.
 *
 * Não conhece Firebase, Firestore ou RBAC.
 * Recebe dados já resolvidos pelo Bootstrap e comunica
 * ações da interface por callbacks.
 * Conforme DEVSTD-001.
 * ============================================================
 */

"use strict";

let moduloInicializado = false;
let callbackLogout = null;

/**
 * Inicializa os controles da interface de sessão.
 *
 * @param {{
 *     onLogout?: function
 * }} callbacks
 */
export function initSessionUI(callbacks = {}) {
    if (moduloInicializado) {
        return;
    }

    const elementos = obterElementosSessao();

    callbackLogout =
        typeof callbacks.onLogout === "function"
            ? callbacks.onLogout
            : null;

    elementos.botaoLogout.addEventListener(
        "click",
        tratarCliqueLogout
    );

    ocultarAvisoInatividade();

    moduloInicializado = true;
}

/**
 * Atualiza a identificação visual do usuário autenticado.
 *
 * @param {{
 *     email?: string,
 *     perfis?: string[]
 * }} usuario
 */
export function mostrarUsuarioSessao(usuario = {}) {
    const elementos = obterElementosSessao();

    const email =
        typeof usuario.email === "string" &&
        usuario.email.trim()
            ? usuario.email.trim()
            : "Usuário autenticado";

    const perfis =
        Array.isArray(usuario.perfis)
            ? usuario.perfis.filter(
                (perfil) =>
                    typeof perfil === "string" &&
                    perfil.trim()
            )
            : [];

    elementos.nome.textContent = email;

    elementos.perfil.textContent =
        perfis.length > 0
            ? perfis.join(" • ")
            : "Perfil operacional";
}

/**
 * Limpa informações visuais da sessão.
 */
export function limparUsuarioSessao() {
    const elementos = obterElementosSessao();

    elementos.nome.textContent =
        "Usuário autenticado";

    elementos.perfil.textContent =
        "Perfil operacional";

    ocultarAvisoInatividade();
}

/**
 * Controla o estado de processamento do botão Sair.
 *
 * @param {boolean} processando
 */
export function definirLogoutEmAndamento(processando) {
    const elementos = obterElementosSessao();

    elementos.botaoLogout.disabled =
        Boolean(processando);

    if (processando) {
        elementos.botaoLogout.setAttribute(
            "aria-busy",
            "true"
        );

        elementos.textoLogout.textContent =
            "Saindo...";
    } else {
        elementos.botaoLogout.removeAttribute(
            "aria-busy"
        );

        elementos.textoLogout.textContent =
            "Sair";
    }
}

/**
 * Exibe o aviso de expiração por inatividade.
 *
 * @param {number} tempoRestanteMs
 */
export function mostrarAvisoInatividade(
    tempoRestanteMs
) {
    const elementos = obterElementosSessao();

    const minutosRestantes =
        Math.max(
            1,
            Math.ceil(
                Number(tempoRestanteMs) /
                (60 * 1000)
            )
        );

    elementos.avisoInatividadeTempo.textContent =
        minutosRestantes === 1
            ? "Sua sessão será encerrada em aproximadamente 1 minuto."
            : `Sua sessão será encerrada em aproximadamente ${minutosRestantes} minutos.`;

    elementos.avisoInatividade.hidden = false;
}

/**
 * Oculta o aviso de expiração por inatividade.
 */
export function ocultarAvisoInatividade() {
    const elementos = obterElementosSessao();

    elementos.avisoInatividade.hidden = true;

    elementos.avisoInatividadeTempo.textContent =
        "Sessão próxima da expiração.";
}

/**
 * Trata a solicitação de logout feita pela interface.
 */
function tratarCliqueLogout() {
    if (!callbackLogout) {
        return;
    }

    callbackLogout();
}

/**
 * Obtém e valida os elementos relacionados à sessão.
 *
 * @returns {{
 *     nome: HTMLElement,
 *     perfil: HTMLElement,
 *     botaoLogout: HTMLButtonElement,
 *     textoLogout: HTMLElement,
 *     avisoInatividade: HTMLElement,
 *     avisoInatividadeTempo: HTMLElement
 * }}
 */
function obterElementosSessao() {
    const nome = document.getElementById(
        "usuarioSessaoNome"
    );

    const perfil = document.getElementById(
        "usuarioSessaoPerfil"
    );

    const botaoLogout = document.getElementById(
        "btnLogout"
    );

    const avisoInatividade = document.getElementById(
        "avisoInatividade"
    );

    const avisoInatividadeTempo =
        document.getElementById(
            "avisoInatividadeTempo"
        );

    if (!nome) {
        throw new Error(
            'O elemento "#usuarioSessaoNome" não foi encontrado.'
        );
    }

    if (!perfil) {
        throw new Error(
            'O elemento "#usuarioSessaoPerfil" não foi encontrado.'
        );
    }

    if (!(botaoLogout instanceof HTMLButtonElement)) {
        throw new Error(
            'O botão "#btnLogout" não foi encontrado.'
        );
    }

    const textoLogout =
        botaoLogout.querySelector(".button__text");

    if (!textoLogout) {
        throw new Error(
            'O texto do botão "#btnLogout" não foi encontrado.'
        );
    }

    if (!avisoInatividade) {
        throw new Error(
            'O elemento "#avisoInatividade" não foi encontrado.'
        );
    }

    if (!avisoInatividadeTempo) {
        throw new Error(
            'O elemento "#avisoInatividadeTempo" não foi encontrado.'
        );
    }

    return {
        nome,
        perfil,
        botaoLogout,
        textoLogout,
        avisoInatividade,
        avisoInatividadeTempo
    };
}
