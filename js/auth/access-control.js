import {
    obterUsuarioSistema
} from "./session.js";

/**
 * Retorna o usuário de negócio atualmente carregado na sessão.
 *
 * @returns {Object|null}
 */
function obterUsuarioAtual() {
    return obterUsuarioSistema();
}

/**
 * Informa se existe um usuário de negócio carregado.
 *
 * @returns {boolean}
 */
function possuiUsuarioValido() {
    return obterUsuarioAtual() !== null;
}

/**
 * Informa se o usuário está operacionalmente ativo.
 *
 * @returns {boolean}
 */
function usuarioEstaAtivo() {
    const usuario = obterUsuarioAtual();

    return usuario !== null && usuario.ativo === true;
}

/**
 * Retorna os perfis atribuídos ao usuário.
 *
 * @returns {string[]}
 */
function obterPerfis() {
    const usuario = obterUsuarioAtual();

    if (!usuario || !Array.isArray(usuario.perfis)) {
        return [];
    }

    return usuario.perfis;
}

/**
 * Informa se o usuário possui determinado perfil.
 *
 * @param {string} perfil
 * @returns {boolean}
 */
function possuiPerfil(perfil) {
    if (!usuarioEstaAtivo()) {
        return false;
    }

    return obterPerfis().includes(perfil);
}

/**
 * Informa se o usuário possui pelo menos um dos perfis informados.
 *
 * @param {string[]} perfis
 * @returns {boolean}
 */
function possuiAlgumPerfil(perfis) {
    if (!usuarioEstaAtivo() || !Array.isArray(perfis)) {
        return false;
    }

    const perfisUsuario = obterPerfis();

    return perfis.some((perfil) => perfisUsuario.includes(perfil));
}

/**
 * Informa se o usuário possui o perfil ADMIN.
 *
 * @returns {boolean}
 */
function ehAdmin() {
    return possuiPerfil("ADMIN");
}

/**
 * Informa se o usuário possui autorização operacional.
 *
 * @returns {boolean}
 */
function possuiAcessoOperacional() {
    return possuiAlgumPerfil([
        "ADMIN",
        "OPERADOR"
    ]);
}

export {
    possuiUsuarioValido,
    usuarioEstaAtivo,
    obterPerfis,
    possuiPerfil,
    possuiAlgumPerfil,
    ehAdmin,
    possuiAcessoOperacional
};