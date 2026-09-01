/**
 * ============================================================
 * ADCS Presença
 * admin-alunos.js
 * ------------------------------------------------------------
 * Orquestrador do módulo administrativo de Gestão de Alunos.
 *
 * Responsabilidades neste incremento:
 * - inicialização do módulo;
 * - carregamento da listagem administrativa;
 * - consulta individual de aluno;
 * - coordenação entre service e UI.
 *
 * Não realiza qualquer operação de escrita no Firestore.
 *
 * Conforme DEVSTD-001.
 * ============================================================
 */

"use strict";

import {
    listarAlunosAdministrativos,
    obterAlunoAdministrativo
} from "./admin-alunos-service.js";

import {
    initAdminAlunosUI,
    mostrarCarregamentoAlunos,
    mostrarErroAlunos,
    mostrarListaAlunos,
    mostrarListaVaziaAlunos,
    mostrarAlunoSelecionado
} from "./admin-alunos-ui.js";

let moduloInicializado = false;
let carregamentoEmAndamento = false;

/**
 * Inicializa o módulo administrativo de alunos.
 */
export function initAdminAlunos() {
    if (moduloInicializado) {
        return;
    }

    initAdminAlunosUI({
        onSelecionarAluno: (alunoId) => {
            void selecionarAlunoAdministrativo(
                alunoId
            );
        },

        onVoltarLista: () => {
            void carregarAlunosAdministrativos();
        }
    });

    moduloInicializado = true;

    console.info(
        "[Admin][Alunos] Módulo inicializado."
    );
}

/**
 * Carrega a listagem administrativa de alunos.
 *
 * @returns {Promise<void>}
 */
export async function carregarAlunosAdministrativos() {
    if (carregamentoEmAndamento) {
        return;
    }

    carregamentoEmAndamento = true;

    mostrarCarregamentoAlunos();

    try {
        const alunos =
            await listarAlunosAdministrativos();

        if (alunos.length === 0) {
            mostrarListaVaziaAlunos();

            return;
        }

        mostrarListaAlunos(alunos);

        console.info(
            "[Admin][Alunos] Listagem carregada.",
            {
                quantidade: alunos.length
            }
        );
    } catch (erro) {
        console.error(
            "[Admin][Alunos] Não foi possível carregar a listagem.",
            erro
        );

        mostrarErroAlunos(
            obterMensagemErroLeitura(erro)
        );
    } finally {
        carregamentoEmAndamento = false;
    }
}

/**
 * Consulta e apresenta um aluno específico.
 *
 * @param {string} alunoId
 * @returns {Promise<void>}
 */
async function selecionarAlunoAdministrativo(
    alunoId
) {
    try {
        const aluno =
            await obterAlunoAdministrativo(
                alunoId
            );

        if (!aluno) {
            mostrarErroAlunos(
                "O aluno selecionado não foi encontrado."
            );

            return;
        }

        mostrarAlunoSelecionado(aluno);

        console.info(
            "[Admin][Alunos] Aluno selecionado.",
            {
                alunoId: aluno.id
            }
        );
    } catch (erro) {
        console.error(
            "[Admin][Alunos] Não foi possível consultar o aluno.",
            erro
        );

        mostrarErroAlunos(
            obterMensagemErroLeitura(erro)
        );
    }
}

/**
 * Converte erros técnicos de leitura em mensagens adequadas
 * para a interface administrativa.
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
        return "Você não possui permissão para consultar os alunos.";
    }

    return "Não foi possível carregar os alunos. Tente novamente.";
}
