/**
 * ============================================================
 * ADCS Presença
 * admin-professores.js
 * ------------------------------------------------------------
 * Orquestrador do módulo administrativo de Gestão de Professores.
 *
 * Responsabilidades neste incremento:
 * - inicialização do módulo;
 * - carregamento da listagem administrativa;
 * - consulta e seleção de professor;
 * - coordenação entre serviço Firestore e interface.
 *
 * Não realiza operações administrativas de escrita
 * neste incremento.
 *
 * Conforme DEVSTD-001.
 * ============================================================
 */

"use strict";

import {
    listarProfessoresAdministrativos,
    obterProfessorAdministrativo
} from "./admin-professores-service.js";

import {
    initAdminProfessoresUI,
    mostrarCarregamentoProfessores,
    mostrarErroProfessores,
    mostrarListaProfessores,
    mostrarListaVaziaProfessores,
    mostrarProfessorSelecionado
} from "./admin-professores-ui.js";

let moduloInicializado = false;
let carregamentoEmAndamento = false;
let professorSelecionado = null;

/**
 * Inicializa o módulo administrativo de professores.
 */
export function initAdminProfessores() {
    if (moduloInicializado) {
        return;
    }

    initAdminProfessoresUI({
        onSelecionarProfessor:
            selecionarProfessorAdministrativo,

        onVoltarLista:
            carregarProfessoresAdministrativos
    });

    moduloInicializado = true;

    console.info(
        "[Admin][Professores] Módulo inicializado."
    );
}

/**
 * Carrega a listagem administrativa de professores.
 *
 * @returns {Promise<void>}
 */
export async function carregarProfessoresAdministrativos() {
    if (carregamentoEmAndamento) {
        return;
    }

    carregamentoEmAndamento = true;
    professorSelecionado = null;

    mostrarCarregamentoProfessores();

    try {
        const professores =
            await listarProfessoresAdministrativos();

        if (professores.length === 0) {
            mostrarListaVaziaProfessores();
            return;
        }

        mostrarListaProfessores(
            professores
        );

        console.info(
            "[Admin][Professores] Listagem carregada.",
            {
                quantidade:
                    professores.length
            }
        );
    } catch (erro) {
        console.error(
            "[Admin][Professores] Não foi possível carregar a listagem.",
            erro
        );

        mostrarErroProfessores(
            obterMensagemErroLeitura(erro)
        );
    } finally {
        carregamentoEmAndamento = false;
    }
}

/**
 * Consulta e apresenta um professor específico.
 *
 * @param {string} professorId
 * @returns {Promise<void>}
 */
async function selecionarProfessorAdministrativo(
    professorId
) {
    try {
        const professor =
            await obterProfessorAdministrativo(
                professorId
            );

        if (!professor) {
            professorSelecionado = null;

            mostrarErroProfessores(
                "O professor selecionado não foi encontrado."
            );

            return;
        }

        professorSelecionado =
            professor;

        mostrarProfessorSelecionado(
            professor
        );

        console.info(
            "[Admin][Professores] Professor selecionado.",
            {
                professorId:
                    professor.id
            }
        );
    } catch (erro) {
        console.error(
            "[Admin][Professores] Não foi possível consultar o professor.",
            erro
        );

        mostrarErroProfessores(
            obterMensagemErroLeitura(erro)
        );
    }
}

/**
 * Traduz falhas de leitura para mensagem de interface.
 *
 * @param {unknown} erro
 * @returns {string}
 */
function obterMensagemErroLeitura(erro) {
    if (
        erro &&
        typeof erro === "object" &&
        "code" in erro &&
        erro.code === "permission-denied"
    ) {
        return "Você não possui permissão para consultar professores.";
    }

    return "Não foi possível carregar os professores. Tente novamente.";
}