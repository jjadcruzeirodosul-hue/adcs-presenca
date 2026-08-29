/**
 * ============================================================
 * ADCS Presença
 * admin-usuarios-operation.js
 * ------------------------------------------------------------
 * Responsável pela montagem das operações administrativas
 * sobre usuarios/{uid}.
 *
 * Incremento 4:
 * - normalização de before/after;
 * - identificação de campos alterados;
 * - geração de operacaoId;
 * - geração determinística de eventoId;
 * - determinação da ação administrativa.
 *
 * Nenhuma operação Firestore é executada neste módulo.
 *
 * Conforme DEVSTD-001.
 * ============================================================
 */

"use strict";

const ENTIDADE_USUARIO = "USUARIO";

const ACOES_USUARIO = Object.freeze({
    ATUALIZADO: "USUARIO_ATUALIZADO",
    ATIVADO: "USUARIO_ATIVADO",
    DESATIVADO: "USUARIO_DESATIVADO"
});

/**
 * Monta uma operação administrativa de alteração de usuário.
 *
 * Retorna null quando não existe alteração funcional.
 *
 * @param {{
 *     uid: string,
 *     ativo: boolean,
 *     perfis: string[]
 * }} usuarioOriginal
 *
 * @param {{
 *     ativo: boolean,
 *     perfis: string[]
 * }} edicao
 *
 * @returns {{
 *     operacaoId: string,
 *     eventoId: string,
 *     entidade: string,
 *     entidadeId: string,
 *     usuarioId: string,
 *     before: {
 *         ativo: boolean,
 *         perfis: string[]
 *     },
 *     after: {
 *         ativo: boolean,
 *         perfis: string[]
 *     },
 *     camposAlterados: string[],
 *     acao: string
 * } | null}
 */
export function montarOperacaoUsuario(
    usuarioOriginal,
    edicao
) {
    const usuarioId =
        normalizarUsuarioId(
            usuarioOriginal?.uid
        );

    if (!usuarioId) {
        throw new Error(
            "Não é possível montar uma operação sem UID de usuário."
        );
    }

    const before =
        normalizarEstadoUsuario(
            usuarioOriginal
        );

    const after =
        normalizarEstadoUsuario(
            edicao
        );

    const camposAlterados =
        identificarCamposAlterados(
            before,
            after
        );

    if (camposAlterados.length === 0) {
        return null;
    }

    const operacaoId =
        gerarOperacaoId();

    const eventoId =
        montarEventoId(
            operacaoId,
            usuarioId
        );

    const acao =
        determinarAcao(
            before,
            after,
            camposAlterados
        );

    return {
        operacaoId,
        eventoId,

        entidade:
            ENTIDADE_USUARIO,

        entidadeId:
            usuarioId,

        usuarioId,

        before,
        after,
        camposAlterados,
        acao
    };
}

/**
 * Identifica os campos funcionais alterados.
 *
 * @param {{
 *     ativo: boolean,
 *     perfis: string[]
 * }} before
 *
 * @param {{
 *     ativo: boolean,
 *     perfis: string[]
 * }} after
 *
 * @returns {string[]}
 */
export function identificarCamposAlterados(
    before,
    after
) {
    const camposAlterados = [];

    if (before.ativo !== after.ativo) {
        camposAlterados.push("ativo");
    }

    if (
        !listasEquivalentes(
            before.perfis,
            after.perfis
        )
    ) {
        camposAlterados.push("perfis");
    }

    return camposAlterados;
}

/**
 * Determina a ação administrativa correspondente.
 *
 * Regra:
 *
 * - somente ativo false -> true:
 *   USUARIO_ATIVADO
 *
 * - somente ativo true -> false:
 *   USUARIO_DESATIVADO
 *
 * - alteração somente de perfis:
 *   USUARIO_ATUALIZADO
 *
 * - ativo + perfis alterados:
 *   USUARIO_ATUALIZADO
 *
 * @param {{
 *     ativo: boolean,
 *     perfis: string[]
 * }} before
 *
 * @param {{
 *     ativo: boolean,
 *     perfis: string[]
 * }} after
 *
 * @param {string[]} camposAlterados
 *
 * @returns {string}
 */
export function determinarAcao(
    before,
    after,
    camposAlterados
) {
    const alterouSomenteAtivo =
        camposAlterados.length === 1 &&
        camposAlterados[0] === "ativo";

    if (alterouSomenteAtivo) {
        if (
            before.ativo === false &&
            after.ativo === true
        ) {
            return ACOES_USUARIO.ATIVADO;
        }

        if (
            before.ativo === true &&
            after.ativo === false
        ) {
            return ACOES_USUARIO.DESATIVADO;
        }
    }

    return ACOES_USUARIO.ATUALIZADO;
}

/**
 * Gera o identificador lógico da operação administrativa.
 *
 * @returns {string}
 */
function gerarOperacaoId() {
    if (
        typeof crypto === "undefined" ||
        typeof crypto.randomUUID !==
            "function"
    ) {
        throw new Error(
            "crypto.randomUUID() não está disponível neste ambiente."
        );
    }

    return crypto.randomUUID();
}

/**
 * Monta o identificador físico determinístico do evento.
 *
 * Formato:
 *
 * <operacaoId>__USUARIO__<usuarioUid>
 *
 * @param {string} operacaoId
 * @param {string} usuarioId
 *
 * @returns {string}
 */
function montarEventoId(
    operacaoId,
    usuarioId
) {
    return (
        `${operacaoId}` +
        `__${ENTIDADE_USUARIO}__` +
        `${usuarioId}`
    );
}

/**
 * Normaliza o estado funcional administrável do usuário.
 *
 * @param {Object} estado
 *
 * @returns {{
 *     ativo: boolean,
 *     perfis: string[]
 * }}
 */
function normalizarEstadoUsuario(estado) {
    return {
        ativo:
            estado?.ativo === true,

        perfis:
            Array.isArray(estado?.perfis)
                ? normalizarPerfis(
                    estado.perfis
                )
                : []
    };
}

/**
 * Normaliza perfis para representação determinística.
 *
 * @param {string[]} perfis
 * @returns {string[]}
 */
function normalizarPerfis(perfis) {
    return [...perfis]
        .map(
            (perfil) =>
                String(perfil)
        )
        .sort();
}

/**
 * @param {unknown} uid
 * @returns {string}
 */
function normalizarUsuarioId(uid) {
    if (typeof uid !== "string") {
        return "";
    }

    return uid.trim();
}

/**
 * Compara listas desconsiderando ordem.
 *
 * @param {string[]} listaA
 * @param {string[]} listaB
 * @returns {boolean}
 */
function listasEquivalentes(
    listaA,
    listaB
) {
    if (
        listaA.length !==
        listaB.length
    ) {
        return false;
    }

    const ordenadaA =
        [...listaA].sort();

    const ordenadaB =
        [...listaB].sort();

    return ordenadaA.every(
        (valor, indice) =>
            valor === ordenadaB[indice]
    );
}

/**
 * Monta o payload físico da auditoria administrativa
 * conforme o contrato exigido pelas Firestore Security Rules.
 *
 * Os valores de autorUid e ocorridoEm são fornecidos pela
 * camada de persistência, pois dependem da sessão e do
 * serverTimestamp().
 *
 * @param {{
 *     operacaoId: string,
 *     entidade: string,
 *     entidadeId: string,
 *     acao: string,
 *     before: {
 *         ativo: boolean,
 *         perfis: string[]
 *     },
 *     after: {
 *         ativo: boolean,
 *         perfis: string[]
 *     },
 *     camposAlterados: string[]
 * }} operacao
 *
 * @param {{
 *     autorUid: string,
 *     ocorridoEm: Object,
 *     contexto?: Object|null
 * }} metadados
 *
 * @returns {Object}
 */
export function montarEventoAuditoriaUsuario(
    operacao,
    {
        autorUid,
        ocorridoEm,
        contexto = null
    }
) {
    if (
        !operacao ||
        typeof operacao.operacaoId !== "string" ||
        operacao.operacaoId === ""
    ) {
        throw new Error(
            "Operação administrativa inválida."
        );
    }

    if (
        typeof autorUid !== "string" ||
        autorUid.trim() === ""
    ) {
        throw new Error(
            "Autor da operação administrativa inválido."
        );
    }

    const before =
        selecionarEstadoAuditado(
            operacao.before,
            operacao.camposAlterados
        );

    const after =
        selecionarEstadoAuditado(
            operacao.after,
            operacao.camposAlterados
        );

    return {
        operacaoId:
            operacao.operacaoId,

        entidade:
            operacao.entidade,

        entidadeId:
            operacao.entidadeId,

        acao:
            operacao.acao,

        autorUid:
            autorUid.trim(),

        ocorridoEm,

        before,
        after,

        camposAlterados:
            [...operacao.camposAlterados],

        contexto,

        versaoSchema: 1
    };
}

/**
 * Seleciona exclusivamente os campos que efetivamente
 * participaram da alteração.
 *
 * @param {{
 *     ativo: boolean,
 *     perfis: string[]
 * }} estado
 *
 * @param {string[]} camposAlterados
 *
 * @returns {Object}
 */
function selecionarEstadoAuditado(
    estado,
    camposAlterados
) {
    const resultado = {};

    if (camposAlterados.includes("ativo")) {
        resultado.ativo =
            estado.ativo;
    }

    if (camposAlterados.includes("perfis")) {
        resultado.perfis =
            [...estado.perfis];
    }

    return resultado;
}

export {
    ACOES_USUARIO,
    ENTIDADE_USUARIO
};