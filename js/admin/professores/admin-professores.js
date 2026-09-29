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
    obterUsuarioAutenticado
} from "../../auth/session.js";

import {
    atualizarProfessorAdministrativo,
    criarProfessorAdministrativo,
    listarProfessoresAdministrativos,
    obterProfessorAdministrativo
} from "./admin-professores-service.js";

import {
	definirEditorProfessoresOcupado,
    initAdminProfessoresUI,
    mostrarCarregamentoProfessores,
    mostrarErroProfessores,
    mostrarEstadoProfessores,
    mostrarFeedbackProfessores,
    mostrarListaProfessores,
    mostrarListaVaziaProfessores,
    mostrarProfessorSelecionado,
    mostrarFormularioEdicaoProfessor,
    mostrarFormularioNovoProfessor
} from "./admin-professores-ui.js";

let moduloInicializado = false;
let carregamentoEmAndamento = false;
let persistenciaEmAndamento = false;
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

        onNovoProfessor:
            iniciarNovoProfessor,

        onEditarProfessor:
            iniciarEdicaoProfessor,

        onPrepararNovoProfessor:
            prepararNovoProfessor,

        onPrepararEdicaoProfessor:
            prepararEdicaoProfessor,

        onCancelarEdicao:
            cancelarEdicaoProfessor,

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

function iniciarNovoProfessor() {
    professorSelecionado = null;

    mostrarFormularioNovoProfessor();
}

function iniciarEdicaoProfessor() {
    if (!professorSelecionado) {
        mostrarErroProfessores(
            "Selecione um professor antes de editar."
        );

        return;
    }

    mostrarFormularioEdicaoProfessor(
        professorSelecionado
    );
}

async function prepararNovoProfessor(dados) {
    if (persistenciaEmAndamento) {
        return;
    }

    const nome =
        typeof dados?.nome === "string"
            ? dados.nome.trim()
            : "";

    if (nome === "") {
        mostrarEstadoProfessores(
            "Informe o nome do professor.",
            "warning"
        );

        return;
    }

    const usuarioAutenticado =
        obterUsuarioAutenticado();

    if (!usuarioAutenticado?.uid) {
        mostrarEstadoProfessores(
            "A sessão autenticada não está disponível.",
            "error"
        );

        return;
    }

    persistenciaEmAndamento = true;

    definirEditorProfessoresOcupado(
        true
    );

    mostrarEstadoProfessores(
        "Criando professor...",
        "info"
    );

    console.info(
        "[Admin][Professores] Criação administrativa iniciada.",
        {
            nome
        }
    );

    try {
        const resultadoCriacao =
            await criarProfessorAdministrativo(
                {
                    nome
                },
                usuarioAutenticado.uid
            );

        console.info(
            "[Admin][Professores] Professor criado com sucesso.",
            {
                professorId:
                    resultadoCriacao.id,

                operacaoId:
                    resultadoCriacao.operacaoId,

                eventoId:
                    resultadoCriacao.eventoId
            }
        );

        const professorCriado =
            await obterProfessorAdministrativo(
                resultadoCriacao.id
            );

        if (!professorCriado) {
            throw new Error(
                "Professor criado não foi localizado após a persistência."
            );
        }

        const professores =
            await listarProfessoresAdministrativos();

        professorSelecionado = null;

        if (professores.length === 0) {
            mostrarListaVaziaProfessores();
        } else {
            mostrarListaProfessores(
                professores
            );
        }

        mostrarFeedbackProfessores(
            "Professor criado com sucesso.",
            "success"
        );
    } catch (erro) {
        console.error(
            "[Admin][Professores] Não foi possível criar o professor.",
            erro
        );

        mostrarEstadoProfessores(
            obterMensagemErroPersistencia(erro),
            "error"
        );
    } finally {
        persistenciaEmAndamento = false;

        definirEditorProfessoresOcupado(
            false
        );
    }
}

async function prepararEdicaoProfessor(dados) {
    if (
        persistenciaEmAndamento ||
        !professorSelecionado
    ) {
        if (!professorSelecionado) {
            mostrarErroProfessores(
                "Nenhum professor selecionado para edição."
            );
        }

        return;
    }

    const nome =
        typeof dados?.nome === "string"
            ? dados.nome.trim()
            : "";

    const ativo =
        typeof dados?.ativo === "boolean"
            ? dados.ativo
            : null;

    if (nome === "") {
        mostrarEstadoProfessores(
            "Informe o nome do professor.",
            "warning"
        );

        return;
    }

    if (ativo === null) {
        mostrarEstadoProfessores(
            "Informe o estado operacional do professor.",
            "warning"
        );

        return;
    }

    const usuarioAutenticado =
        obterUsuarioAutenticado();

    if (!usuarioAutenticado?.uid) {
        mostrarEstadoProfessores(
            "A sessão autenticada não está disponível.",
            "error"
        );

        return;
    }

    persistenciaEmAndamento = true;

    definirEditorProfessoresOcupado(
        true
    );

    mostrarEstadoProfessores(
        "Salvando alterações...",
        "info"
    );

    try {
        const resultadoAtualizacao =
            await atualizarProfessorAdministrativo(
                professorSelecionado.id,
                {
                    nome,
                    ativo
                },
                usuarioAutenticado.uid
            );

        /*
         * No-op funcional:
         * nenhuma escrita e nenhuma auditoria ocorreram.
         */
        if (resultadoAtualizacao.noOp) {
            mostrarProfessorSelecionado(
                professorSelecionado
            );

            mostrarEstadoProfessores(
                "Nenhuma alteração para salvar.",
                "info"
            );

            return;
        }

        console.info(
            "[Admin][Professores] Professor atualizado com sucesso.",
            {
                professorId:
                    resultadoAtualizacao.id,

                operacaoId:
                    resultadoAtualizacao.operacaoId,

                eventoId:
                    resultadoAtualizacao.eventoId
            }
        );

        const professorAtualizado =
            await obterProfessorAdministrativo(
                resultadoAtualizacao.id
            );

        if (!professorAtualizado) {
            throw new Error(
                "Professor atualizado não foi localizado após a persistência."
            );
        }

        const professores =
            await listarProfessoresAdministrativos();

        professorSelecionado = null;

        if (professores.length === 0) {
            mostrarListaVaziaProfessores();
        } else {
            mostrarListaProfessores(
                professores
            );
        }

        mostrarFeedbackProfessores(
            "Professor atualizado com sucesso.",
            "success"
        );
    } catch (erro) {
        console.error(
            "[Admin][Professores] Não foi possível atualizar o professor.",
            erro
        );

        mostrarEstadoProfessores(
            obterMensagemErroPersistencia(erro),
            "error"
        );
    } finally {
        persistenciaEmAndamento = false;

        definirEditorProfessoresOcupado(
            false
        );
    }
}

function cancelarEdicaoProfessor() {
    if (professorSelecionado) {
        mostrarProfessorSelecionado(
            professorSelecionado
        );

        return;
    }

    void carregarProfessoresAdministrativos();
}

/**
 * Traduz falhas de persistência para mensagem de interface.
 *
 * @param {unknown} erro
 * @returns {string}
 */
function obterMensagemErroPersistencia(
    erro
) {
    if (
        erro &&
        typeof erro === "object" &&
        erro.code === "permission-denied"
    ) {
        return (
            "Você não possui permissão para realizar " +
            "esta operação administrativa."
        );
    }

    if (
        erro instanceof Error &&
        erro.message
    ) {
        return erro.message;
    }

    return (
        "Não foi possível criar o professor. " +
        "Tente novamente."
    );
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