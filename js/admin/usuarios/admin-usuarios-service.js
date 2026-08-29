/**
 * ============================================================
 * ADCS Presença
 * admin-usuarios-service.js
 * ------------------------------------------------------------
 * Camada de acesso administrativo aos dados de usuários.
 *
 * Responsabilidades:
 * - listagem de usuários;
 * - consulta individual;
 * - persistência atômica de alterações administrativas;
 * - criação do respectivo evento de auditoria no mesmo batch.
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
    serverTimestamp,
    writeBatch
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

import {
    db
} from "../../firebase.js";

import {
    montarEventoAuditoriaUsuario
} from "./admin-usuarios-operation.js";

/**
 * Lista os usuários cadastrados.
 *
 * A autorização efetiva da operação permanece nas
 * Firestore Security Rules.
 *
 * @returns {Promise<Object[]>}
 */
export async function listarUsuariosAdministrativos() {
    const referencia = collection(
        db,
        "usuarios"
    );

    const resultado = await getDocs(referencia);

    return resultado.docs
        .map((documento) => ({
            uid: documento.id,
            ...documento.data()
        }))
        .sort(compararUsuarios);
}

/**
 * Obtém um usuário específico pelo UID.
 *
 * @param {string} uid
 * @returns {Promise<Object|null>}
 */
export async function obterUsuarioAdministrativo(uid) {
    if (
        typeof uid !== "string" ||
        uid.trim() === ""
    ) {
        throw new TypeError(
            "UID de usuário inválido."
        );
    }

    const referencia = doc(
        db,
        "usuarios",
        uid
    );

    const documento = await getDoc(referencia);

    if (!documento.exists()) {
        return null;
    }

    return {
        uid: documento.id,
        ...documento.data()
    };
}

/**
 * Persiste atomicamente uma alteração administrativa de usuário
 * e seu respectivo evento de auditoria.
 *
 * O commit somente será aceito quando UPDATE e CREATE forem
 * simultaneamente válidos pelas Firestore Security Rules.
 *
 * @param {{
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
 * }} operacao
 *
 * @param {string} autorUid
 *
 * @returns {Promise<void>}
 */
export async function persistirOperacaoUsuario(
    operacao,
    autorUid
) {
    if (
        !operacao ||
        typeof operacao.usuarioId !== "string" ||
        operacao.usuarioId.trim() === ""
    ) {
        throw new Error(
            "Operação administrativa de usuário inválida."
        );
    }

    const timestampServidor =
        serverTimestamp();

    const evento =
        montarEventoAuditoriaUsuario(
            operacao,
            {
                autorUid,
                ocorridoEm:
                    timestampServidor,

                contexto: null
            }
        );

    const referenciaUsuario =
        doc(
            db,
            "usuarios",
            operacao.usuarioId
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
        referenciaUsuario,
        {
            ativo:
                operacao.after.ativo,

            perfis:
                [...operacao.after.perfis],

            atualizadoEm:
                timestampServidor,

            atualizadoPor:
                autorUid,

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
 * Define ordenação estável da listagem.
 *
 * Como o contrato atual não possui campo de nome ou e-mail,
 * utiliza UID como identificador disponível no documento.
 *
 * @param {{uid?: string}} usuarioA
 * @param {{uid?: string}} usuarioB
 * @returns {number}
 */
function compararUsuarios(usuarioA, usuarioB) {
    return String(usuarioA.uid || "")
        .localeCompare(
            String(usuarioB.uid || ""),
            "pt-BR",
            {
                sensitivity: "base"
            }
        );
}