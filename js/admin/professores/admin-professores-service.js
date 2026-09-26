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
    getDocs
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

import { db } from "../../firebase.js";

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