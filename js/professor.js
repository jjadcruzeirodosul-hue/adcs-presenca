/**
 * ============================================================
 * ADCS Presença
 * professor.js
 * ------------------------------------------------------------
 * Responsável pela consulta e apresentação dos professores.
 * Conforme DEVSTD-001.
 * ============================================================
 */

"use strict";

import {
    collection,
    getDocs,
    orderBy,
    query,
    where
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

import { db } from "./firebase.js";

const COLECAO_PROFESSORES = "professores";
const VALOR_PROFESSOR_ATIVO = true;

/**
 * Carrega os professores ativos do Cloud Firestore
 * e preenche o campo de seleção da interface.
 *
 * @returns {Promise<void>}
 */
export async function carregarProfessores() {
    const selectProfessor = obterSelectProfessor();

    prepararSelectParaCarregamento(selectProfessor);

    try {
        const professores = await consultarProfessoresAtivos();

        preencherSelectProfessores(selectProfessor, professores);

        console.info(
            `${professores.length} professor(es) ativo(s) carregado(s).`
        );
    } catch (erro) {
        console.error("Erro ao carregar professores:", erro);

        apresentarErroNoSelect(selectProfessor);

        const erroCarregamento = new Error(
			"Não foi possível carregar os professores."
		);

		erroCarregamento.cause = erro;

		throw erroCarregamento;
    }
}

/**
 * Consulta os professores ativos, ordenados pelo nome.
 *
 * @returns {Promise<Array<{id: string, nome: string}>>}
 */
async function consultarProfessoresAtivos() {
    const referenciaProfessores = collection(
        db,
        COLECAO_PROFESSORES
    );

    const consultaProfessores = query(
        referenciaProfessores,
        where("ativo", "==", VALOR_PROFESSOR_ATIVO),
        orderBy("nome", "asc")
    );

    const resultado = await getDocs(consultaProfessores);

    return resultado.docs
        .map((documento) => ({
            id: documento.id,
            nome: normalizarNome(documento.data().nome)
        }))
        .filter((professor) => professor.nome !== "");
}

/**
 * Retorna o campo de seleção de professor.
 *
 * @returns {HTMLSelectElement}
 */
function obterSelectProfessor() {
    const selectProfessor = document.getElementById("professor");

    if (!(selectProfessor instanceof HTMLSelectElement)) {
        throw new Error(
            'O elemento <select id="professor"> não foi encontrado.'
        );
    }

    return selectProfessor;
}

/**
 * Prepara o select enquanto os dados são carregados.
 *
 * @param {HTMLSelectElement} selectProfessor
 */
function prepararSelectParaCarregamento(selectProfessor) {
    substituirOpcoes(
        selectProfessor,
        "Carregando professores..."
    );

    selectProfessor.disabled = true;
    selectProfessor.setAttribute("aria-busy", "true");
}

/**
 * Preenche o select com os professores encontrados.
 *
 * @param {HTMLSelectElement} selectProfessor
 * @param {Array<{id: string, nome: string}>} professores
 */
function preencherSelectProfessores(
    selectProfessor,
    professores
) {
    limparSelect(selectProfessor);

    if (professores.length === 0) {
        adicionarOpcao(
            selectProfessor,
            "",
            "Nenhum professor disponível"
        );

        selectProfessor.disabled = true;
        selectProfessor.removeAttribute("aria-busy");

        return;
    }

    adicionarOpcao(
        selectProfessor,
        "",
        "Selecione o professor"
    );

    professores.forEach((professor) => {
        adicionarOpcao(
            selectProfessor,
            professor.id,
            professor.nome
        );
    });

    selectProfessor.disabled = false;
    selectProfessor.removeAttribute("aria-busy");
}

/**
 * Exibe o estado de erro no campo de seleção.
 *
 * @param {HTMLSelectElement} selectProfessor
 */
function apresentarErroNoSelect(selectProfessor) {
    substituirOpcoes(
        selectProfessor,
        "Não foi possível carregar os professores"
    );

    selectProfessor.disabled = true;
    selectProfessor.removeAttribute("aria-busy");
}

/**
 * Remove todas as opções atuais.
 *
 * @param {HTMLSelectElement} selectProfessor
 */
function limparSelect(selectProfessor) {
    selectProfessor.replaceChildren();
}

/**
 * Substitui todas as opções por uma única mensagem.
 *
 * @param {HTMLSelectElement} selectProfessor
 * @param {string} texto
 */
function substituirOpcoes(selectProfessor, texto) {
    limparSelect(selectProfessor);
    adicionarOpcao(selectProfessor, "", texto);
}

/**
 * Adiciona uma opção ao campo de seleção.
 *
 * @param {HTMLSelectElement} selectProfessor
 * @param {string} valor
 * @param {string} texto
 */
function adicionarOpcao(selectProfessor, valor, texto) {
    const opcao = document.createElement("option");

    opcao.value = valor;
    opcao.textContent = texto;

    selectProfessor.append(opcao);
}

/**
 * Normaliza o nome recebido do Cloud Firestore.
 *
 * @param {unknown} nome
 * @returns {string}
 */
function normalizarNome(nome) {
    if (typeof nome !== "string") {
        return "";
    }

    return nome.trim();
}