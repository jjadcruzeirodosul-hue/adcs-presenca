/**
 * ============================================================
 * ADCS Presença
 * admin-alunos-service.js
 * ------------------------------------------------------------
 * Camada de acesso administrativo aos dados de alunos.
 *
 * Responsabilidades neste incremento:
 * - listagem de alunos;
 * - consulta individual de aluno.
 *
 * Não realiza qualquer operação de escrita no Firestore.
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
    getDocs
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

import {
    db
} from "../../firebase.js";

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