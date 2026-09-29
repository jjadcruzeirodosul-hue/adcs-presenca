/**
 * Operações administrativas da Gestão de Professores.
 *
 * Responsabilidades:
 * - normalização dos dados funcionais;
 * - geração de operacaoId;
 * - montagem do eventoId determinístico;
 * - montagem da operação administrativa;
 * - montagem do evento de auditoria.
 *
 * Este módulo não realiza operações Firestore.
 */

"use strict";

const ENTIDADE_PROFESSOR =
    "PROFESSOR";

const ACOES_PROFESSOR = {
    CRIADO: "PROFESSOR_CRIADO",
    ATUALIZADO: "PROFESSOR_ATUALIZADO",
    ATIVADO: "PROFESSOR_ATIVADO",
    DESATIVADO: "PROFESSOR_DESATIVADO"
};

/**
 * Monta a operação administrativa de criação de professor.
 *
 * @param {string} professorId
 * @param {{
 *     nome: string
 * }} dados
 *
 * @returns {{
 *     operacaoId: string,
 *     eventoId: string,
 *     entidade: string,
 *     entidadeId: string,
 *     professorId: string,
 *     before: null,
 *     after: {
 *         nome: string,
 *         ativo: boolean
 *     },
 *     camposAlterados: string[],
 *     acao: string
 * }}
 */
export function montarOperacaoCriacaoProfessor(
    professorId,
    dados
) {
    const professorIdNormalizado =
        normalizarProfessorId(
            professorId
        );

    const nome =
        normalizarTexto(
            dados?.nome
        );

    if (nome === "") {
        throw new TypeError(
            "Nome do professor é obrigatório."
        );
    }

    const operacaoId =
        gerarOperacaoId();

    const eventoId =
        montarEventoIdProfessor(
            operacaoId,
            professorIdNormalizado
        );

    return {
        operacaoId,
        eventoId,

        entidade:
            ENTIDADE_PROFESSOR,

        entidadeId:
            professorIdNormalizado,

        professorId:
            professorIdNormalizado,

        before:
            null,

        after: {
            nome,
            ativo: true
        },

        camposAlterados: [
            "nome",
            "ativo"
        ],

        acao:
            ACOES_PROFESSOR.CRIADO
    };
}

/**
 * Monta a operação administrativa de atualização
 * do nome de um professor.
 *
 * Retorna null quando não existe alteração funcional.
 *
 * @param {string} professorId
 * @param {{
 *     nome: string,
 *     ativo: boolean
 * }} before
 * @param {{
 *     nome: string
 * }} dados
 *
 * @returns {Object|null}
 */
export function montarOperacaoAtualizacaoProfessor(
    professorId,
    before,
    dados
) {
    const professorIdNormalizado =
        normalizarProfessorId(
            professorId
        );

    const nomeAnterior =
        normalizarTexto(
            before?.nome
        );

    const nomeNovo =
        normalizarTexto(
            dados?.nome
        );

    if (nomeAnterior === "") {
        throw new TypeError(
            "Nome atual do professor é obrigatório."
        );
    }

    if (nomeNovo === "") {
        throw new TypeError(
            "Nome do professor é obrigatório."
        );
    }

    if (typeof before?.ativo !== "boolean") {
        throw new TypeError(
            "Status atual do professor é inválido."
        );
    }

    if (typeof dados?.ativo !== "boolean") {
        throw new TypeError(
            "Status do professor é inválido."
        );
    }

    const ativoAnterior =
        before.ativo;

    const ativoNovo =
        dados.ativo;

    const nomeAlterado =
        nomeNovo !== nomeAnterior;

    const ativoAlterado =
        ativoNovo !== ativoAnterior;

    /*
     * No-op funcional:
     * nenhuma operação, escrita ou auditoria deve
     * ser produzida quando nenhum campo funcional mudou.
     */
    if (
        !nomeAlterado &&
        !ativoAlterado
    ) {
        return null;
    }

    const camposAlterados = [];

    if (nomeAlterado) {
        camposAlterados.push(
            "nome"
        );
    }

    if (ativoAlterado) {
        camposAlterados.push(
            "ativo"
        );
    }

    let acao =
        ACOES_PROFESSOR.ATUALIZADO;

    /*
     * S4-DEC-006:
     * ATIVADO/DESATIVADO são reservados para
     * alterações exclusivamente do campo ativo.
     *
     * Nome + ativo na mesma operação permanece
     * PROFESSOR_ATUALIZADO.
     */
    if (
        !nomeAlterado &&
        ativoAlterado
    ) {
        acao =
            ativoNovo
                ? ACOES_PROFESSOR.ATIVADO
                : ACOES_PROFESSOR.DESATIVADO;
    }

    const operacaoId =
        gerarOperacaoId();

    const eventoId =
        montarEventoIdProfessor(
            operacaoId,
            professorIdNormalizado
        );

    return {
        operacaoId,
        eventoId,

        entidade:
            ENTIDADE_PROFESSOR,

        entidadeId:
            professorIdNormalizado,

        professorId:
            professorIdNormalizado,

        before: {
            nome:
                nomeAnterior,

            ativo:
                ativoAnterior
        },

        after: {
            nome:
                nomeNovo,

            ativo:
                ativoNovo
        },

        camposAlterados,

        acao
    };
}

/**
 * Monta o evento de auditoria correspondente
 * à criação de professor.
 *
 * @param {Object} operacao
 * @param {{
 *     autorUid: string,
 *     ocorridoEm: Object,
 *     contexto?: Object|null
 * }} metadados
 *
 * @returns {Object}
 */
export function montarEventoAuditoriaCriacaoProfessor(
    operacao,
    {
        autorUid,
        ocorridoEm,
        contexto = null
    }
) {
    if (
        !operacao ||
        operacao.acao !== ACOES_PROFESSOR.CRIADO ||
        operacao.before !== null ||
        typeof operacao.professorId !== "string" ||
        operacao.professorId.trim() === ""
    ) {
        throw new Error(
            "Operação administrativa de criação de professor inválida."
        );
    }

    if (
        typeof autorUid !== "string" ||
        autorUid.trim() === ""
    ) {
        throw new TypeError(
            "UID do autor da operação é obrigatório."
        );
    }

    return {
        operacaoId:
            operacao.operacaoId,

        entidade:
            ENTIDADE_PROFESSOR,

        entidadeId:
            operacao.professorId,

        acao:
            ACOES_PROFESSOR.CRIADO,

        autorUid:
            autorUid.trim(),

        ocorridoEm,

        before:
            null,

        after: {
            nome:
                operacao.after.nome,

            ativo:
                true
        },

        camposAlterados: [
            ...operacao.camposAlterados
        ],

        contexto,

        versaoSchema:
            1
    };
}

/**
 * Monta o evento de auditoria correspondente
 * à atualização de professor.
 *
 * @param {Object} operacao
 * @param {{
 *     autorUid: string,
 *     ocorridoEm: Object,
 *     contexto?: Object|null
 * }} metadados
 *
 * @returns {Object}
 */
export function montarEventoAuditoriaAtualizacaoProfessor(
    operacao,
    {
        autorUid,
        ocorridoEm,
        contexto = null
    }
) {
    const acoesAtualizacaoValidas = [
        ACOES_PROFESSOR.ATUALIZADO,
        ACOES_PROFESSOR.ATIVADO,
        ACOES_PROFESSOR.DESATIVADO
    ];

    if (
        !operacao ||
        !acoesAtualizacaoValidas.includes(
            operacao.acao
        ) ||
        !operacao.before ||
        !operacao.after ||
        typeof operacao.professorId !== "string" ||
        operacao.professorId.trim() === "" ||
        !Array.isArray(
            operacao.camposAlterados
        ) ||
        operacao.camposAlterados.length === 0
    ) {
        throw new Error(
            "Operação administrativa de atualização de professor inválida."
        );
    }

    if (
        typeof autorUid !== "string" ||
        autorUid.trim() === ""
    ) {
        throw new TypeError(
            "UID do autor da operação é obrigatório."
        );
    }

    const before = {};
    const after = {};

    for (
        const campo of operacao.camposAlterados
    ) {
        if (
            campo !== "nome" &&
            campo !== "ativo"
        ) {
            throw new Error(
                "Campo alterado de professor inválido."
            );
        }

        before[campo] =
            operacao.before[campo];

        after[campo] =
            operacao.after[campo];
    }

    return {
        operacaoId:
            operacao.operacaoId,

        entidade:
            ENTIDADE_PROFESSOR,

        entidadeId:
            operacao.professorId,

        acao:
            operacao.acao,

        autorUid:
            autorUid.trim(),

        ocorridoEm,

        before,

        after,

        camposAlterados: [
            ...operacao.camposAlterados
        ],

        contexto,

        versaoSchema: 1
    };
}

/**
 * Normaliza o identificador físico do professor.
 *
 * @param {unknown} professorId
 * @returns {string}
 */
function normalizarProfessorId(
    professorId
) {
    if (
        typeof professorId !== "string" ||
        professorId.trim() === ""
    ) {
        throw new TypeError(
            "ID do professor é obrigatório."
        );
    }

    return professorId.trim();
}

/**
 * Normaliza texto funcional.
 *
 * @param {unknown} valor
 * @returns {string}
 */
function normalizarTexto(valor) {
    return typeof valor === "string"
        ? valor.trim()
        : "";
}

/**
 * Gera identificador único da operação administrativa.
 *
 * @returns {string}
 */
function gerarOperacaoId() {
    if (
        !globalThis.crypto ||
        typeof globalThis.crypto.randomUUID !== "function"
    ) {
        throw new Error(
            "Não foi possível gerar o identificador da operação."
        );
    }

    return globalThis.crypto.randomUUID();
}

/**
 * Monta o identificador determinístico do evento:
 *
 * <operacaoId>__PROFESSOR__<professorId>
 *
 * @param {string} operacaoId
 * @param {string} professorId
 * @returns {string}
 */
function montarEventoIdProfessor(
    operacaoId,
    professorId
) {
    return (
        `${operacaoId}` +
        `__PROFESSOR__` +
        `${professorId}`
    );
}
