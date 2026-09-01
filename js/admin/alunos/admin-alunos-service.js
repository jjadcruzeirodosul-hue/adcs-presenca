/**
 * ============================================================
 * ADCS Presença
 * admin-alunos-service.js
 * ------------------------------------------------------------
 * Camada de acesso administrativo aos dados de alunos.
 *
 * Responsabilidades:
 * - listagem de alunos;
 * - consulta individual de aluno;
 * - criação transacional de aluno;
 * - emissão sequencial de matrícula;
 * - atualização atômica do contador;
 * - criação da auditoria administrativa correspondente.
 *
 * A autorização efetiva permanece nas Firestore Security Rules.
 *
 * Conforme DEVSTD-001.
 * ============================================================
 */

"use strict";

import {
    collection,
    doc,
    getDoc,
    getDocs,
    runTransaction,
    serverTimestamp,
    writeBatch
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

import {
    db
} from "../../firebase.js";

import {
    montarEventoAuditoriaAluno,
    montarEventoAuditoriaCriacaoAluno,
    montarOperacaoCriacaoAluno
} from "./admin-alunos-operation.js";

/**
 * Lista os alunos cadastrados.
 *
 * A autorização efetiva da operação permanece nas
 * Firestore Security Rules.
 *
 * @returns {Promise<Object[]>}
 */
export async function listarAlunosAdministrativos() {
    const referencia =
        collection(
            db,
            "alunos"
        );

    const resultado =
        await getDocs(referencia);

    return resultado.docs
        .map((documento) => ({
            id: documento.id,
            ...documento.data()
        }))
        .sort(compararAlunos);
}

/**
 * Obtém um aluno específico pelo ID do documento.
 *
 * @param {string} alunoId
 * @returns {Promise<Object|null>}
 */
export async function obterAlunoAdministrativo(
    alunoId
) {
    if (
        typeof alunoId !== "string" ||
        alunoId.trim() === ""
    ) {
        throw new TypeError(
            "ID de aluno inválido."
        );
    }

    const referencia =
        doc(
            db,
            "alunos",
            alunoId
        );

    const documento =
        await getDoc(referencia);

    if (!documento.exists()) {
        return null;
    }

    return {
        id: documento.id,
        ...documento.data()
    };
}

/**
 * Cria um aluno por meio de uma transação Firestore.
 *
 * A matrícula é emitida exclusivamente dentro da transação,
 * a partir de contadores/matriculasAlunos.
 *
 * A mesma transação:
 *
 * - cria alunos/{alunoId};
 * - incrementa contadores/matriculasAlunos;
 * - grava ultimoAlunoId;
 * - cria auditoriaAdministrativa/{eventoId}.
 *
 * Nenhuma matrícula recebida da interface é utilizada.
 *
 * @param {{
 *     nome: string,
 *     faixa: string
 * }} dados
 *
 * @param {string} autorUid
 *
 * @returns {Promise<{
 *     id: string,
 *     nome: string,
 *     faixa: string,
 *     matricula: string,
 *     ativo: boolean,
 *     operacaoId: string,
 *     eventoId: string
 * }>}
 */
export async function criarAlunoAdministrativo(
    dados,
    autorUid
) {
    const nome =
        normalizarTextoObrigatorio(
            dados?.nome,
            "Nome do aluno"
        );

    const faixa =
        normalizarTextoObrigatorio(
            dados?.faixa,
            "Faixa do aluno"
        );

    const autorUidNormalizado =
        normalizarTextoObrigatorio(
            autorUid,
            "UID do autor"
        );

    const referenciaContador =
        doc(
            db,
            "contadores",
            "matriculasAlunos"
        );

    /*
     * O ID do aluno é definido antes da transação.
     *
     * Isso permite que contador, aluno e auditoria utilizem
     * deterministicamente o mesmo alunoId durante todo o commit.
     */
    const referenciaAluno =
        doc(
            collection(
                db,
                "alunos"
            )
        );

    return runTransaction(
        db,
        async (transacao) => {
            /*
             * Todas as leituras da transação devem ocorrer
             * antes das escritas.
             */
            const snapshotContador =
                await transacao.get(
                    referenciaContador
                );

            if (!snapshotContador.exists()) {
                throw new Error(
                    "Contador de matrículas de alunos não encontrado."
                );
            }

            const contador =
                snapshotContador.data();

            validarContadorMatriculas(
                contador
            );

            const novoNumero =
                contador.ultimoNumeroEmitido + 1;

            if (novoNumero > 999999) {
                throw new Error(
                    "Limite máximo de matrículas atingido."
                );
            }

            const matricula =
                String(novoNumero)
                    .padStart(
                        6,
                        "0"
                    );

            const operacao =
                montarOperacaoCriacaoAluno(
                    referenciaAluno.id,
                    {
                        nome,
                        faixa,
                        matricula
                    }
                );

            /*
             * Uma única sentinela de timestamp é reutilizada
             * em aluno, contador e auditoria.
             *
             * As Security Rules validam esses valores contra
             * request.time no mesmo commit.
             */
            const timestampServidor =
                serverTimestamp();

            const evento =
                montarEventoAuditoriaCriacaoAluno(
                    operacao,
                    {
                        autorUid:
                            autorUidNormalizado,

                        ocorridoEm:
                            timestampServidor,

                        contexto:
                            null
                    }
                );

            const referenciaAuditoria =
                doc(
                    db,
                    "auditoriaAdministrativa",
                    operacao.eventoId
                );

            /*
             * CREATE alunos/{alunoId}
             */
            transacao.set(
                referenciaAluno,
                {
                    nome:
                        operacao.after.nome,

                    faixa:
                        operacao.after.faixa,

                    matricula:
                        operacao.after.matricula,

                    ativo:
                        true,

                    atualizadoEm:
                        timestampServidor,

                    atualizadoPor:
                        autorUidNormalizado,

                    ultimaOperacaoId:
                        operacao.operacaoId
                }
            );

            /*
             * UPDATE contadores/matriculasAlunos
             *
             * versaoSchema não é alterada.
             *
             * Caso o contador esteja no estado legado sem
             * ultimoAlunoId, este UPDATE introduz o campo
             * conforme S4-DEC-005.
             */
            transacao.update(
                referenciaContador,
                {
                    ultimoNumeroEmitido:
                        novoNumero,

                    atualizadoEm:
                        timestampServidor,

                    atualizadoPor:
                        autorUidNormalizado,

                    ultimaOperacaoId:
                        operacao.operacaoId,

                    ultimoAlunoId:
                        referenciaAluno.id
                }
            );

            /*
             * CREATE auditoriaAdministrativa/{eventoId}
             */
            transacao.set(
                referenciaAuditoria,
                evento
            );

            return {
                id:
                    referenciaAluno.id,

                nome:
                    operacao.after.nome,

                faixa:
                    operacao.after.faixa,

                matricula:
                    operacao.after.matricula,

                ativo:
                    true,

                operacaoId:
                    operacao.operacaoId,

                eventoId:
                    operacao.eventoId
            };
        }
    );
}

/**
 * Persiste atomicamente uma alteração administrativa de aluno
 * e seu respectivo evento de auditoria.
 *
 * Aplicável a:
 * - atualização funcional;
 * - ativação;
 * - desativação.
 *
 * Matrícula não participa do UPDATE.
 *
 * @param {{
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
 * }} operacao
 *
 * @param {string} autorUid
 *
 * @returns {Promise<void>}
 */
export async function persistirOperacaoAluno(
    operacao,
    autorUid
) {
    if (
        !operacao ||
        typeof operacao.alunoId !== "string" ||
        operacao.alunoId.trim() === ""
    ) {
        throw new Error(
            "Operação administrativa de aluno inválida."
        );
    }

    const autorUidNormalizado =
        normalizarTextoObrigatorio(
            autorUid,
            "UID do autor"
        );

    const timestampServidor =
        serverTimestamp();

    const evento =
        montarEventoAuditoriaAluno(
            operacao,
            {
                autorUid:
                    autorUidNormalizado,

                ocorridoEm:
                    timestampServidor,

                contexto:
                    null
            }
        );

    const referenciaAluno =
        doc(
            db,
            "alunos",
            operacao.alunoId
        );

    const referenciaAuditoria =
        doc(
            db,
            "auditoriaAdministrativa",
            operacao.eventoId
        );

    const batch =
        writeBatch(db);

    batch.update(
        referenciaAluno,
        {
            nome:
                operacao.after.nome,

            faixa:
                operacao.after.faixa,

            ativo:
                operacao.after.ativo,

            atualizadoEm:
                timestampServidor,

            atualizadoPor:
                autorUidNormalizado,

            ultimaOperacaoId:
                operacao.operacaoId
        }
    );

    batch.set(
        referenciaAuditoria,
        evento
    );

    await batch.commit();
}

/**
 * Valida o estado mínimo necessário do contador antes da emissão.
 *
 * O contrato definitivo continua sendo aplicado pelas
 * Firestore Security Rules.
 *
 * @param {Object} contador
 * @returns {void}
 */
function validarContadorMatriculas(
    contador
) {
    if (
        !contador ||
        !Number.isInteger(
            contador.ultimoNumeroEmitido
        ) ||
        contador.ultimoNumeroEmitido < 0 ||
        contador.ultimoNumeroEmitido > 999999
    ) {
        throw new Error(
            "Contador de matrículas possui estado inválido."
        );
    }

    if (
        !Number.isInteger(
            contador.versaoSchema
        ) ||
        contador.versaoSchema !== 1
    ) {
        throw new Error(
            "Versão do contador de matrículas é inválida."
        );
    }
}

/**
 * Normaliza um texto obrigatório.
 *
 * @param {*} valor
 * @param {string} nomeCampo
 * @returns {string}
 */
function normalizarTextoObrigatorio(
    valor,
    nomeCampo
) {
    const texto =
        String(valor ?? "")
            .trim();

    if (texto === "") {
        throw new TypeError(
            `${nomeCampo} é obrigatório.`
        );
    }

    return texto;
}

/**
 * Define ordenação estável da listagem administrativa.
 *
 * Prioriza nome e utiliza matrícula e ID como critérios
 * adicionais para estabilidade.
 *
 * @param {{id?: string, nome?: string, matricula?: string}} alunoA
 * @param {{id?: string, nome?: string, matricula?: string}} alunoB
 * @returns {number}
 */
function compararAlunos(
    alunoA,
    alunoB
) {
    const comparacaoNome =
        String(alunoA.nome || "")
            .localeCompare(
                String(alunoB.nome || ""),
                "pt-BR",
                {
                    sensitivity: "base"
                }
            );

    if (comparacaoNome !== 0) {
        return comparacaoNome;
    }

    const comparacaoMatricula =
        String(alunoA.matricula || "")
            .localeCompare(
                String(alunoB.matricula || ""),
                "pt-BR"
            );

    if (comparacaoMatricula !== 0) {
        return comparacaoMatricula;
    }

    return String(alunoA.id || "")
        .localeCompare(
            String(alunoB.id || ""),
            "pt-BR"
        );
}
