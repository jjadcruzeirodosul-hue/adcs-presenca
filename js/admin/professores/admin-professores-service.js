/**
 * ADCS Presença
 * Sprint 4 — S4-005 — Gestão de Professores
 *
 * Serviço Firestore do módulo administrativo de professores.
 *
 * Responsabilidades:
 * - listar professores;
 * - consultar professor por ID físico.
 *
 * A autorização efetiva das operações permanece nas
 * Firestore Security Rules.
 */

"use strict";

import {
    collection,
    doc,
    getDoc,
    getDocs,
    serverTimestamp,
    writeBatch
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

import { db } from "../../firebase.js";

import {
    montarEventoAuditoriaAtualizacaoProfessor,
    montarEventoAuditoriaCriacaoProfessor,
    montarOperacaoAtualizacaoProfessor,
    montarOperacaoCriacaoProfessor
} from "./admin-professores-operation.js";

/**
 * Lista os professores disponíveis para administração.
 *
 * @returns {Promise<Object[]>}
 */
export async function listarProfessoresAdministrativos() {
    const referencia =
        collection(
            db,
            "professores"
        );

    const resultado =
        await getDocs(referencia);

    return resultado.docs
        .map((documento) => ({
            id: documento.id,
            ...documento.data()
        }))
        .sort(compararProfessores);
}

/**
 * Obtém um professor específico pelo ID físico.
 *
 * @param {string} professorId
 * @returns {Promise<Object|null>}
 */
export async function obterProfessorAdministrativo(
    professorId
) {
    if (
        typeof professorId !== "string" ||
        professorId.trim() === ""
    ) {
        throw new TypeError(
            "ID de professor inválido."
        );
    }

    const referencia =
        doc(
            db,
            "professores",
            professorId
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
 * Cria um professor e seu respectivo evento de auditoria
 * na mesma unidade atômica.
 *
 * @param {{
 *     nome: string
 * }} dados
 *
 * @param {string} autorUid
 *
 * @returns {Promise<{
 *     id: string,
 *     nome: string,
 *     ativo: boolean,
 *     operacaoId: string,
 *     eventoId: string
 * }>}
 */
export async function criarProfessorAdministrativo(
    dados,
    autorUid
) {
    const nome =
        normalizarTextoObrigatorio(
            dados?.nome,
            "Nome do professor"
        );

    const autorUidNormalizado =
        normalizarTextoObrigatorio(
            autorUid,
            "UID do autor"
        );

    /*
     * O ID físico é definido antes do batch para que
     * professor e auditoria compartilhem deterministicamente
     * o mesmo professorId.
     */
    const referenciaProfessor =
        doc(
            collection(
                db,
                "professores"
            )
        );

    const operacao =
        montarOperacaoCriacaoProfessor(
            referenciaProfessor.id,
            {
                nome
            }
        );

    /*
     * A mesma sentinela é reutilizada no professor
     * e no evento de auditoria.
     */
    const timestampServidor =
        serverTimestamp();

    const evento =
        montarEventoAuditoriaCriacaoProfessor(
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

    const batch =
        writeBatch(db);

    /*
     * CREATE professores/{professorId}
     */
    batch.set(
        referenciaProfessor,
        {
            nome:
                operacao.after.nome,

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
     * CREATE auditoriaAdministrativa/{eventoId}
     */
    batch.set(
        referenciaAuditoria,
        evento
    );

    await batch.commit();

    return {
        id:
            referenciaProfessor.id,

        nome:
            operacao.after.nome,

        ativo:
            true,

        operacaoId:
            operacao.operacaoId,

        eventoId:
            operacao.eventoId
    };
}

/**
 * Atualiza o nome de um professor e cria seu respectivo
 * evento de auditoria na mesma unidade atômica.
 *
 * Retorna noOp = true quando não existe alteração funcional.
 *
 * @param {string} professorId
 * @param {{
 *     nome: string
 * }} dados
 * @param {string} autorUid
 *
 * @returns {Promise<{
 *     id: string,
 *     nome: string,
 *     ativo: boolean,
 *     noOp: boolean,
 *     operacaoId: string|null,
 *     eventoId: string|null
 * }>}
 */
export async function atualizarProfessorAdministrativo(
    professorId,
    dados,
    autorUid
) {
    const professorIdNormalizado =
        normalizarTextoObrigatorio(
            professorId,
            "ID do professor"
        );

    const nome =
        normalizarTextoObrigatorio(
            dados?.nome,
            "Nome do professor"
        );

    const autorUidNormalizado =
        normalizarTextoObrigatorio(
            autorUid,
            "UID do autor"
        );

    const referenciaProfessor =
        doc(
            db,
            "professores",
            professorIdNormalizado
        );

    const documentoAtual =
        await getDoc(
            referenciaProfessor
        );

    if (!documentoAtual.exists()) {
        throw new Error(
            "Professor não localizado para atualização."
        );
    }

    const professorAtual =
        documentoAtual.data();

    const operacao =
        montarOperacaoAtualizacaoProfessor(
            professorIdNormalizado,
            {
                nome:
                    professorAtual.nome,

                ativo:
                    professorAtual.ativo
            },
            {
                nome
            }
        );

    /*
     * No-op funcional:
     * nenhuma escrita e nenhuma auditoria são produzidas.
     */
    if (operacao === null) {
        return {
            id:
                professorIdNormalizado,

            nome:
                professorAtual.nome,

            ativo:
                professorAtual.ativo,

            noOp:
                true,

            operacaoId:
                null,

            eventoId:
                null
        };
    }

    const timestampServidor =
        serverTimestamp();

    const evento =
        montarEventoAuditoriaAtualizacaoProfessor(
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

    const batch =
        writeBatch(db);

    /*
     * UPDATE professores/{professorId}
     *
     * O campo ativo não é administrado pelo FE-05.
     */
    batch.update(
        referenciaProfessor,
        {
            nome:
                operacao.after.nome,

            atualizadoEm:
                timestampServidor,

            atualizadoPor:
                autorUidNormalizado,

            ultimaOperacaoId:
                operacao.operacaoId
        }
    );

    /*
     * CREATE auditoriaAdministrativa/{eventoId}
     */
    batch.set(
        referenciaAuditoria,
        evento
    );

    await batch.commit();

    return {
        id:
            professorIdNormalizado,

        nome:
            operacao.after.nome,

        ativo:
            operacao.after.ativo,

        noOp:
            false,

        operacaoId:
            operacao.operacaoId,

        eventoId:
            operacao.eventoId
    };
}

/**
 * Normaliza e valida texto obrigatório recebido
 * pelo serviço administrativo.
 *
 * @param {unknown} valor
 * @param {string} rotulo
 * @returns {string}
 */
function normalizarTextoObrigatorio(
    valor,
    rotulo
) {
    if (
        typeof valor !== "string" ||
        valor.trim() === ""
    ) {
        throw new TypeError(
            `${rotulo} é obrigatório.`
        );
    }

    return valor.trim();
}

/**
 * Define ordenação estável da listagem administrativa.
 *
 * Prioriza nome e utiliza o ID físico como critério
 * adicional para estabilidade.
 *
 * @param {{id?: string, nome?: string}} professorA
 * @param {{id?: string, nome?: string}} professorB
 * @returns {number}
 */
function compararProfessores(
    professorA,
    professorB
) {
    const comparacaoNome =
        String(professorA.nome || "")
            .localeCompare(
                String(professorB.nome || ""),
                "pt-BR",
                {
                    sensitivity: "base"
                }
            );

    if (comparacaoNome !== 0) {
        return comparacaoNome;
    }

    return String(professorA.id || "")
        .localeCompare(
            String(professorB.id || ""),
            "pt-BR"
        );
}