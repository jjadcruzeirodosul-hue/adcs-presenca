/**
 * ============================================================
 * ADCS Presença
 * presenca.js
 * ------------------------------------------------------------
 * Responsável pelo registro e controle de duplicidade das
 * presenças no Cloud Firestore.
 * Conforme DEVSTD-001.
 * ============================================================
 */

"use strict";

import {
    doc,
    runTransaction,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

import { db } from "./firebase.js";

const COLECAO_PRESENCAS = "presencas";
const ORIGENS_PERMITIDAS = Object.freeze([
    "MANUAL",
    "QR_CODE"
]);

/**
 * Registra a presença de um aluno.
 *
 * O ID determinístico segue o padrão:
 * <alunoId>_<YYYY-MM-DD>
 *
 * @param {{
 *     aluno: {
 *         id: string,
 *         nome: string,
 *         matricula: string,
 *         faixa: string
 *     },
 *     professor: {
 *         id: string,
 *         nome: string
 *     },
 *     origem: "MANUAL" | "QR_CODE"
 * }} dados
 *
 * @returns {Promise<{
 *     status: "registrada" | "duplicada",
 *     id: string,
 *     dia: string
 * }>}
 */
export async function registrarPresenca(dados) {
    const presenca = normalizarDadosPresenca(dados);
    const dia = obterDiaAtual();
    const idPresenca = montarIdPresenca(
        presenca.aluno.id,
        dia
    );

    const referenciaPresenca = doc(
        db,
        COLECAO_PRESENCAS,
        idPresenca
    );

    const resultado = await runTransaction(
        db,
        async (transacao) => {
            const documentoExistente = await transacao.get(
                referenciaPresenca
            );

            if (documentoExistente.exists()) {
                return {
                    status: "duplicada",
                    id: idPresenca,
                    dia
                };
            }

            transacao.set(referenciaPresenca, {
                alunoId: presenca.aluno.id,
                professorId: presenca.professor.id,
                nomeAluno: presenca.aluno.nome,
                nomeProfessor: presenca.professor.nome,
                matricula: presenca.aluno.matricula,
                faixa: presenca.aluno.faixa,
                dia,
                dataHora: serverTimestamp(),
                registradoEm: serverTimestamp(),
                origem: presenca.origem
            });

            return {
                status: "registrada",
                id: idPresenca,
                dia
            };
        }
    );

    return resultado;
}

/**
 * Normaliza e valida os dados necessários ao registro.
 *
 * @param {unknown} dados
 * @returns {{
 *     aluno: {
 *         id: string,
 *         nome: string,
 *         matricula: string,
 *         faixa: string
 *     },
 *     professor: {
 *         id: string,
 *         nome: string
 *     },
 *     origem: "MANUAL" | "QR_CODE"
 * }}
 */
function normalizarDadosPresenca(dados) {
    if (!dados || typeof dados !== "object") {
        throw new Error(
            "Os dados da presença não foram informados."
        );
    }

    const aluno = normalizarAluno(dados.aluno);
    const professor = normalizarProfessor(dados.professor);
    const origem = normalizarOrigem(dados.origem);

    return {
        aluno,
        professor,
        origem
    };
}

/**
 * Valida e normaliza os dados do aluno.
 *
 * @param {unknown} aluno
 * @returns {{
 *     id: string,
 *     nome: string,
 *     matricula: string,
 *     faixa: string
 * }}
 */
function normalizarAluno(aluno) {
    if (!aluno || typeof aluno !== "object") {
        throw new Error(
            "Os dados do aluno não foram informados."
        );
    }

    const id = normalizarTexto(aluno.id);
    const nome = normalizarTexto(aluno.nome);
    const matricula = normalizarTexto(aluno.matricula);
    const faixa = normalizarTexto(aluno.faixa);

    if (!id) {
        throw new Error("O identificador do aluno é obrigatório.");
    }

    if (!nome) {
        throw new Error("O nome do aluno é obrigatório.");
    }

    if (!matricula) {
        throw new Error("A matrícula do aluno é obrigatória.");
    }

    return {
        id,
        nome,
        matricula,
        faixa
    };
}

/**
 * Valida e normaliza os dados do professor.
 *
 * @param {unknown} professor
 * @returns {{
 *     id: string,
 *     nome: string
 * }}
 */
function normalizarProfessor(professor) {
    if (!professor || typeof professor !== "object") {
        throw new Error(
            "Os dados do professor não foram informados."
        );
    }

    const id = normalizarTexto(professor.id);
    const nome = normalizarTexto(professor.nome);

    if (!id) {
        throw new Error(
            "O identificador do professor é obrigatório."
        );
    }

    if (!nome) {
        throw new Error(
            "O nome do professor é obrigatório."
        );
    }

    return {
        id,
        nome
    };
}

/**
 * Valida a origem do registro.
 *
 * @param {unknown} origem
 * @returns {"MANUAL" | "QR_CODE"}
 */
function normalizarOrigem(origem) {
    const origemNormalizada = normalizarTexto(origem)
        .toLocaleUpperCase("pt-BR");

    if (!ORIGENS_PERMITIDAS.includes(origemNormalizada)) {
        throw new Error(
            "A origem do registro de presença é inválida."
        );
    }

    return origemNormalizada;
}

/**
 * Monta o identificador determinístico da presença.
 *
 * @param {string} alunoId
 * @param {string} dia
 * @returns {string}
 */
function montarIdPresenca(alunoId, dia) {
    return `${alunoId}_${dia}`;
}

/**
 * Retorna a data atual no formato YYYY-MM-DD.
 *
 * A data é calculada considerando o fuso horário oficial
 * utilizado pelo projeto.
 *
 * @returns {string}
 */
function obterDiaAtual() {
    const partes = new Intl.DateTimeFormat(
        "en-CA",
        {
            timeZone: "America/Sao_Paulo",
            year: "numeric",
            month: "2-digit",
            day: "2-digit"
        }
    ).formatToParts(new Date());

    const valores = Object.fromEntries(
        partes
            .filter((parte) => parte.type !== "literal")
            .map((parte) => [parte.type, parte.value])
    );

    return `${valores.year}-${valores.month}-${valores.day}`;
}

/**
 * Normaliza valores textuais.
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