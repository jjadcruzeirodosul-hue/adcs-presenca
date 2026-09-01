/**
 * ============================================================
 * ADCS Presença
 * admin-alunos-operation.js
 * ------------------------------------------------------------
 * Responsável pela montagem das operações administrativas
 * de atualização sobre alunos/{alunoId}.
 *
 * FE-04:
 * - normalização de before/after;
 * - identificação de campos funcionais alterados;
 * - detecção de no-op;
 * - geração de operacaoId;
 * - geração determinística de eventoId;
 * - determinação da ação administrativa;
 * - montagem do payload de auditoria.
 *
 * Nenhuma operação Firestore é executada neste módulo.
 *
 * Conforme DEVSTD-001.
 * ============================================================
 */

"use strict";

const ENTIDADE_ALUNO = "ALUNO";

const ACOES_ALUNO = Object.freeze({
    ATUALIZADO: "ALUNO_ATUALIZADO",
    ATIVADO: "ALUNO_ATIVADO",
    DESATIVADO: "ALUNO_DESATIVADO"
});

/**
 * Monta uma operação administrativa de atualização de aluno.
 *
 * Retorna null quando não existe alteração funcional.
 *
 * @param {{
 *     id: string,
 *     nome: string,
 *     faixa: string,
 *     ativo: boolean
 * }} alunoOriginal
 *
 * @param {{
 *     nome: string,
 *     faixa: string,
 *     ativo: boolean
 * }} edicao
 *
 * @returns {{
 *     operacaoId: string,
 *     eventoId: string,
 *     entidade: string,
 *     entidadeId: string,
 *     alunoId: string,
 *     before: {
 *         nome: string,
 *         faixa: string,
 *         ativo: boolean
 *     },
 *     after: {
 *         nome: string,
 *         faixa: string,
 *         ativo: boolean
 *     },
 *     camposAlterados: string[],
 *     acao: string
 * } | null}
 */
export function montarOperacaoAluno(
    alunoOriginal,
    edicao
) {
    const alunoId =
        normalizarAlunoId(
            alunoOriginal?.id
        );

    if (!alunoId) {
        throw new Error(
            "Não é possível montar uma operação sem ID de aluno."
        );
    }

    const before =
        normalizarEstadoAluno(
            alunoOriginal
        );

    const after =
        normalizarEstadoAluno(
            edicao
        );

    const camposAlterados =
        identificarCamposAlteradosAluno(
            before,
            after
        );

    if (camposAlterados.length === 0) {
        return null;
    }

    const operacaoId =
        gerarOperacaoId();

    const eventoId =
        montarEventoIdAluno(
            operacaoId,
            alunoId
        );

    const acao =
        determinarAcaoAluno(
            before,
            after,
            camposAlterados
        );

    return {
        operacaoId,
        eventoId,

        entidade:
            ENTIDADE_ALUNO,

        entidadeId:
            alunoId,

        alunoId,

        before,
        after,
        camposAlterados,
        acao
    };
}

/**
 * Identifica os campos funcionais efetivamente alterados.
 *
 * Ordem determinística:
 * nome → faixa → ativo
 *
 * @param {{
 *     nome: string,
 *     faixa: string,
 *     ativo: boolean
 * }} before
 *
 * @param {{
 *     nome: string,
 *     faixa: string,
 *     ativo: boolean
 * }} after
 *
 * @returns {string[]}
 */
export function identificarCamposAlteradosAluno(
    before,
    after
) {
    const camposAlterados = [];

    if (before.nome !== after.nome) {
        camposAlterados.push("nome");
    }

    if (before.faixa !== after.faixa) {
        camposAlterados.push("faixa");
    }

    if (before.ativo !== after.ativo) {
        camposAlterados.push("ativo");
    }

    return camposAlterados;
}

/**
 * Determina a ação administrativa correspondente.
 *
 * - somente ativo false -> true:
 *   ALUNO_ATIVADO
 *
 * - somente ativo true -> false:
 *   ALUNO_DESATIVADO
 *
 * - nome e/ou faixa:
 *   ALUNO_ATUALIZADO
 *
 * - nome/faixa + ativo:
 *   ALUNO_ATUALIZADO
 *
 * @param {{
 *     nome: string,
 *     faixa: string,
 *     ativo: boolean
 * }} before
 *
 * @param {{
 *     nome: string,
 *     faixa: string,
 *     ativo: boolean
 * }} after
 *
 * @param {string[]} camposAlterados
 *
 * @returns {string}
 */
export function determinarAcaoAluno(
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
            return ACOES_ALUNO.ATIVADO;
        }

        if (
            before.ativo === true &&
            after.ativo === false
        ) {
            return ACOES_ALUNO.DESATIVADO;
        }
    }

    return ACOES_ALUNO.ATUALIZADO;
}

/**
 * Monta o payload físico da auditoria administrativa.
 *
 * autorUid e ocorridoEm serão fornecidos futuramente pela
 * camada de persistência, pois dependem da sessão e do
 * serverTimestamp().
 *
 * @param {{
 *     operacaoId: string,
 *     entidade: string,
 *     entidadeId: string,
 *     acao: string,
 *     before: {
 *         nome: string,
 *         faixa: string,
 *         ativo: boolean
 *     },
 *     after: {
 *         nome: string,
 *         faixa: string,
 *         ativo: boolean
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
export function montarEventoAuditoriaAluno(
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
            "Operação administrativa de aluno inválida."
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
        selecionarEstadoAuditadoAluno(
            operacao.before,
            operacao.camposAlterados
        );

    const after =
        selecionarEstadoAuditadoAluno(
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
 * Monta o ID físico determinístico do evento.
 *
 * Formato:
 *
 * <operacaoId>__ALUNO__<alunoId>
 *
 * @param {string} operacaoId
 * @param {string} alunoId
 * @returns {string}
 */
function montarEventoIdAluno(
    operacaoId,
    alunoId
) {
    return (
        `${operacaoId}` +
        `__${ENTIDADE_ALUNO}__` +
        `${alunoId}`
    );
}

/**
 * Normaliza o estado funcional administrável do aluno.
 *
 * Matrícula deliberadamente não participa deste estado,
 * pois é imutável.
 *
 * @param {Object} estado
 *
 * @returns {{
 *     nome: string,
 *     faixa: string,
 *     ativo: boolean
 * }}
 */
function normalizarEstadoAluno(estado) {
    return {
        nome:
            normalizarTexto(
                estado?.nome
            ),

        faixa:
            normalizarTexto(
                estado?.faixa
            ),

        ativo:
            estado?.ativo === true
    };
}

/**
 * Seleciona somente os campos que efetivamente participaram
 * da alteração.
 *
 * @param {{
 *     nome: string,
 *     faixa: string,
 *     ativo: boolean
 * }} estado
 *
 * @param {string[]} camposAlterados
 *
 * @returns {Object}
 */
function selecionarEstadoAuditadoAluno(
    estado,
    camposAlterados
) {
    const resultado = {};

    if (
        camposAlterados.includes(
            "nome"
        )
    ) {
        resultado.nome =
            estado.nome;
    }

    if (
        camposAlterados.includes(
            "faixa"
        )
    ) {
        resultado.faixa =
            estado.faixa;
    }

    if (
        camposAlterados.includes(
            "ativo"
        )
    ) {
        resultado.ativo =
            estado.ativo;
    }

    return resultado;
}

/**
 * @param {unknown} alunoId
 * @returns {string}
 */
function normalizarAlunoId(alunoId) {
    if (typeof alunoId !== "string") {
        return "";
    }

    return alunoId.trim();
}

/**
 * @param {unknown} valor
 * @returns {string}
 */
function normalizarTexto(valor) {
    if (typeof valor !== "string") {
        return "";
    }

    return valor.trim();
}

export {
    ACOES_ALUNO,
    ENTIDADE_ALUNO
};