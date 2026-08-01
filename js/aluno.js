/**
 * ============================================================
 * ADCS Presença
 * aluno.js
 * ------------------------------------------------------------
 * Responsável pela consulta e validação dos alunos.
 * Conforme DEVSTD-001.
 * ============================================================
 */

"use strict";

import {
    collection,
    getDocs,
    limit,
    query,
    where
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

import { db } from "./firebase.js";

const COLECAO_ALUNOS = "alunos";

/**
 * Busca um aluno pela matrícula.
 *
 * @param {string} matricula
 * @returns {Promise<{
 *     id: string,
 *     nome: string,
 *     matricula: string,
 *     faixa: string,
 *     ativo: boolean
 * } | null>}
 */
export async function buscarAlunoPorMatricula(matricula) {
    const matriculaNormalizada = normalizarMatricula(matricula);

    if (matriculaNormalizada === "") {
        throw new Error("A matrícula do aluno é obrigatória.");
    }

    const referenciaAlunos = collection(
        db,
        COLECAO_ALUNOS
    );

    const consultaAluno = query(
        referenciaAlunos,
        where("matricula", "==", matriculaNormalizada),
        limit(1)
    );

    const resultado = await getDocs(consultaAluno);

    if (resultado.empty) {
        return null;
    }

    const documento = resultado.docs[0];
    const dados = documento.data();

    return {
        id: documento.id,
        nome: normalizarTexto(dados.nome),
        matricula: normalizarMatricula(dados.matricula),
        faixa: normalizarTexto(dados.faixa),
        ativo: dados.ativo === true
    };
}

/**
 * Valida se o aluno está ativo.
 *
 * @param {{ativo: boolean} | null} aluno
 * @returns {boolean}
 */
export function alunoEstaAtivo(aluno) {
    return aluno?.ativo === true;
}

/**
 * Normaliza a matrícula recebida.
 *
 * @param {unknown} matricula
 * @returns {string}
 */
export function normalizarMatricula(matricula) {
    if (typeof matricula !== "string") {
        return "";
    }

    return matricula.trim();
}

/**
 * Normaliza valores textuais recebidos do Cloud Firestore.
 *
 * @param {unknown} valor
 * @returns {string}
 */
function normalizarTexto(valor) {
    if (typeof valor !== "string") {
        return "";
    }

    return valor.trim();
}