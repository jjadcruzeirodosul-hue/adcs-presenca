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
 * - criação local de novo aluno;
 * - edição local de aluno existente;
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
    mostrarAlunoSelecionado,
    mostrarFormularioNovoAluno,
    mostrarFormularioEdicaoAluno,
    mostrarEstadoAlunos
} from "./admin-alunos-ui.js";

let moduloInicializado = false;
let carregamentoEmAndamento = false;
let alunoSelecionado = null;

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

        onNovoAluno: () => {
            iniciarNovoAluno();
        },

        onEditarAluno: () => {
            iniciarEdicaoAlunoSelecionado();
        },

        onPrepararNovoAluno: (dados) => {
            prepararNovoAlunoLocalmente(
                dados
            );
        },

        onPrepararEdicaoAluno: (dados) => {
            prepararEdicaoAlunoLocalmente(
                dados
            );
        },

        onCancelarEdicao: () => {
            cancelarEdicaoLocal();
        },

        onVoltarLista: () => {
            alunoSelecionado = null;

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
    alunoSelecionado = null;

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
            alunoSelecionado = null;

            mostrarErroAlunos(
                "O aluno selecionado não foi encontrado."
            );

            return;
        }

        alunoSelecionado = aluno;

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
 * Inicia o formulário local de criação.
 */
function iniciarNovoAluno() {
    alunoSelecionado = null;

    mostrarFormularioNovoAluno();

    console.info(
        "[Admin][Alunos] Formulário local de criação iniciado."
    );
}

/**
 * Inicia o formulário local de edição.
 */
function iniciarEdicaoAlunoSelecionado() {
    if (!alunoSelecionado) {
        mostrarEstadoAlunos(
            "Selecione um aluno antes de editar.",
            "warning"
        );

        return;
    }

    mostrarFormularioEdicaoAluno(
        alunoSelecionado
    );

    console.info(
        "[Admin][Alunos] Formulário local de edição iniciado.",
        {
            alunoId: alunoSelecionado.id
        }
    );
}

/**
 * Valida e prepara localmente um novo aluno.
 *
 * Não persiste dados.
 *
 * @param {{
 *     nome: string,
 *     faixa: string
 * }} dados
 */
function prepararNovoAlunoLocalmente(
    dados
) {
    const nome =
        normalizarTexto(dados.nome);

    const faixa =
        normalizarTexto(dados.faixa);

    if (!nome) {
        mostrarEstadoAlunos(
            "Informe o nome do aluno.",
            "warning"
        );

        return;
    }

    if (!faixa) {
        mostrarEstadoAlunos(
            "Informe a faixa do aluno.",
            "warning"
        );

        return;
    }

    console.info(
        "[Admin][Alunos] Novo aluno preparado localmente.",
        {
            nome,
            faixa,
            ativo: true
        }
    );

    mostrarEstadoAlunos(
        "Dados do novo aluno validados localmente. " +
        "Nenhuma alteração foi gravada.",
        "success"
    );
}

/**
 * Valida e prepara localmente a edição de um aluno.
 *
 * Não persiste dados.
 *
 * @param {{
 *     nome: string,
 *     faixa: string,
 *     ativo: boolean
 * }} dados
 */
function prepararEdicaoAlunoLocalmente(
    dados
) {
    if (!alunoSelecionado) {
        mostrarEstadoAlunos(
            "Nenhum aluno selecionado para edição.",
            "warning"
        );

        return;
    }

    const nome =
        normalizarTexto(dados.nome);

    const faixa =
        normalizarTexto(dados.faixa);

    const ativo =
        dados.ativo === true;

    if (!nome) {
        mostrarEstadoAlunos(
            "Informe o nome do aluno.",
            "warning"
        );

        return;
    }

    if (!faixa) {
        mostrarEstadoAlunos(
            "Informe a faixa do aluno.",
            "warning"
        );

        return;
    }

    console.info(
        "[Admin][Alunos] Alteração de aluno preparada localmente.",
        {
            alunoId:
                alunoSelecionado.id,

            antes: {
                nome:
                    alunoSelecionado.nome || "",
                faixa:
                    alunoSelecionado.faixa || "",
                ativo:
                    alunoSelecionado.ativo === true
            },

            depois: {
                nome,
                faixa,
                ativo
            }
        }
    );

    mostrarEstadoAlunos(
        "Alterações validadas localmente. " +
        "Nenhuma alteração foi gravada.",
        "success"
    );
}

/**
 * Cancela criação ou edição local.
 */
function cancelarEdicaoLocal() {
    if (alunoSelecionado) {
        mostrarAlunoSelecionado(
            alunoSelecionado
        );

        console.info(
            "[Admin][Alunos] Edição local cancelada.",
            {
                alunoId:
                    alunoSelecionado.id
            }
        );

        return;
    }

    void carregarAlunosAdministrativos();

    console.info(
        "[Admin][Alunos] Criação local cancelada."
    );
}

/**
 * Normaliza valor textual do formulário.
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
