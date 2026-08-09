import {
    observarAutenticacao
} from "./auth-service.js";

import {
    obterUsuario
} from "../services/usuario-service.js";

let usuarioAutenticado = null;
let usuarioSistema = null;
let sessaoInicializada = false;

/**
 * Inicializa a observação do estado de autenticação
 * e carrega o usuário correspondente no Firestore.
 *
 * @param {function} callback
 * @returns {function} Função para cancelar a observação.
 */
function inicializarSessao(callback) {
    return observarAutenticacao(async (usuario) => {
        usuarioAutenticado = usuario;
        usuarioSistema = null;

        if (usuarioAutenticado) {
            usuarioSistema = await obterUsuario(usuarioAutenticado.uid);
        }

        sessaoInicializada = true;

        if (typeof callback === "function") {
            callback({
                usuarioAutenticado,
                usuarioSistema
            });
        }
    });
}

/**
 * Retorna o usuário autenticado pelo Firebase Authentication.
 *
 * @returns {User|null}
 */
function obterUsuarioAutenticado() {
    return usuarioAutenticado;
}

/**
 * Retorna o usuário de negócio armazenado em usuarios/{uid}.
 *
 * @returns {Object|null}
 */
function obterUsuarioSistema() {
    return usuarioSistema;
}

/**
 * Informa se existe um usuário autenticado.
 *
 * @returns {boolean}
 */
function possuiSessaoAutenticada() {
    return usuarioAutenticado !== null;
}

/**
 * Informa se o documento usuarios/{uid} foi localizado.
 *
 * @returns {boolean}
 */
function possuiUsuarioSistema() {
    return usuarioSistema !== null;
}

/**
 * Informa se o estado inicial da sessão já foi resolvido.
 *
 * @returns {boolean}
 */
function sessaoFoiInicializada() {
    return sessaoInicializada;
}

export {
    inicializarSessao,
    obterUsuarioAutenticado,
    obterUsuarioSistema,
    possuiSessaoAutenticada,
    possuiUsuarioSistema,
    sessaoFoiInicializada
};