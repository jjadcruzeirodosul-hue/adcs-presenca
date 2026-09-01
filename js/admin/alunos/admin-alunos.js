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
    obterUsuarioAutenticado
} from "../../auth/session.js";

import {
    criarAlunoAdministrativo,
    listarAlunosAdministrativos,
    obterAlunoAdministrativo,
    persistirOperacaoAluno
} from "./admin-alunos-service.js";

import {
    definirEditorAlunosOcupado,
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

import {
    montarOperacaoAluno
} from "./admin-alunos-operation.js";

let moduloInicializado = false;
let carregamentoEmAndamento = false;
let persistenciaEmAndamento = false;
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
			void criarNovoAlunoAdministrativo(
				dados
			);
		},

		onPrepararEdicaoAluno: (dados) => {
			void persistirEdicaoAluno(
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
 * Valida e cria um novo aluno por meio da operação
 * transacional administrativa.
 *
 * A matrícula é definida exclusivamente pelo service,
 * dentro da transação do Firestore.
 *
 * @param {{
 *     nome: string,
 *     faixa: string
 * }} dados
 *
 * @returns {Promise<void>}
 */
async function criarNovoAlunoAdministrativo(
    dados
) {
    if (persistenciaEmAndamento) {
        return;
    }

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

    const usuarioAutenticado =
        obterUsuarioAutenticado();

    if (!usuarioAutenticado?.uid) {
        mostrarEstadoAlunos(
            "A sessão autenticada não está disponível.",
            "error"
        );

        return;
    }

    persistenciaEmAndamento = true;

    definirEditorAlunosOcupado(
        true
    );

    mostrarEstadoAlunos(
        "Criando aluno e emitindo matrícula...",
        "info"
    );

    console.info(
        "[Admin][Alunos] Criação administrativa iniciada.",
        {
            nome,
            faixa
        }
    );

    try {
        const resultadoCriacao =
            await criarAlunoAdministrativo(
                {
                    nome,
                    faixa
                },
                usuarioAutenticado.uid
            );

        console.info(
            "[Admin][Alunos] Aluno criado com sucesso.",
            {
                alunoId:
                    resultadoCriacao.id,

                matricula:
                    resultadoCriacao.matricula,

                operacaoId:
                    resultadoCriacao.operacaoId,

                eventoId:
                    resultadoCriacao.eventoId
            }
        );

        /*
         * Reconsulta obrigatória do documento recém-criado.
         * A UI passa a refletir o estado efetivamente persistido.
         */
        const alunoCriado =
            await obterAlunoAdministrativo(
                resultadoCriacao.id
            );

        if (!alunoCriado) {
            throw new Error(
                "Aluno criado não foi localizado após a persistência."
            );
        }

        alunoSelecionado =
            alunoCriado;

        /*
         * Atualiza imediatamente a listagem administrativa.
         */
        const alunos =
            await listarAlunosAdministrativos();

        if (alunos.length === 0) {
            mostrarListaVaziaAlunos();
        } else {
            mostrarListaAlunos(
                alunos
            );
        }

        /*
         * A renderização da lista oculta o editor.
         * Reabrimos o aluno persistido para exibir inclusive
         * a matrícula emitida pela transação.
         */
        mostrarAlunoSelecionado(
            alunoSelecionado
        );

        mostrarEstadoAlunos(
            "Aluno criado com sucesso. Matrícula " +
            resultadoCriacao.matricula +
            " emitida.",
            "success"
        );
    } catch (erro) {
        console.error(
            "[Admin][Alunos] Falha ao criar aluno:",
            erro
        );

        mostrarEstadoAlunos(
            obterMensagemErroPersistencia(
                erro
            ),
            "error"
        );
    } finally {
        persistenciaEmAndamento = false;

        definirEditorAlunosOcupado(
            false
        );
    }
}

/**
 * Valida, monta e persiste uma alteração administrativa de aluno.
 *
 * @param {{
 *     nome: string,
 *     faixa: string,
 *     ativo: boolean
 * }} dados
 *
 * @returns {Promise<void>}
 */
async function persistirEdicaoAluno(
    dados
) {
    if (persistenciaEmAndamento) {
        return;
    }

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

    let operacao;

    try {
        operacao =
            montarOperacaoAluno(
                alunoSelecionado,
                {
                    nome,
                    faixa,
                    ativo
                }
            );
    } catch (erro) {
        console.error(
            "[Admin][Alunos] Falha ao montar operação administrativa:",
            erro
        );

        mostrarEstadoAlunos(
            "Não foi possível preparar a operação administrativa.",
            "error"
        );

        return;
    }

    if (!operacao) {
        console.info(
            "[Admin][Alunos] Nenhuma alteração funcional identificada.",
            {
                alunoId:
                    alunoSelecionado.id
            }
        );

        mostrarEstadoAlunos(
            "Nenhuma alteração foi identificada.",
            "info"
        );

        return;
    }

    const usuarioAutenticado =
        obterUsuarioAutenticado();

    if (!usuarioAutenticado?.uid) {
        mostrarEstadoAlunos(
            "A sessão autenticada não está disponível.",
            "error"
        );

        return;
    }

    persistenciaEmAndamento = true;

    definirEditorAlunosOcupado(
        true
    );

    mostrarEstadoAlunos(
        "Salvando alteração administrativa...",
        "info"
    );

    console.info(
        "[Admin][Alunos] Persistência administrativa iniciada.",
        {
            alunoId:
                operacao.alunoId,

            operacaoId:
                operacao.operacaoId,

            eventoId:
                operacao.eventoId,

            acao:
                operacao.acao,

            camposAlterados:
                operacao.camposAlterados
        }
    );

    try {
        await persistirOperacaoAluno(
            operacao,
            usuarioAutenticado.uid
        );

        console.info(
            "[Admin][Alunos] Operação administrativa persistida.",
            {
                alunoId:
                    operacao.alunoId,

                operacaoId:
                    operacao.operacaoId,

                eventoId:
                    operacao.eventoId,

                acao:
                    operacao.acao
            }
        );

        /*
         * Reconsulta obrigatória do documento alterado.
         */
        const alunoAtualizado =
            await obterAlunoAdministrativo(
                operacao.alunoId
            );

        if (!alunoAtualizado) {
            throw new Error(
                "Aluno atualizado não foi localizado após a persistência."
            );
        }

        alunoSelecionado =
            alunoAtualizado;

        /*
         * Atualiza também a listagem administrativa.
         */
        const alunos =
            await listarAlunosAdministrativos();

        if (alunos.length === 0) {
            mostrarListaVaziaAlunos();
        } else {
            mostrarListaAlunos(
                alunos
            );
        }

        /*
         * A renderização da lista oculta o editor.
         * Reabrimos o aluno já reconsultado do Firestore.
         */
        mostrarAlunoSelecionado(
            alunoSelecionado
        );

        mostrarEstadoAlunos(
            "Alteração administrativa salva com sucesso.",
            "success"
        );
    } catch (erro) {
        console.error(
            "[Admin][Alunos] Falha ao persistir operação administrativa:",
            erro
        );

        mostrarEstadoAlunos(
            obterMensagemErroPersistencia(
                erro
            ),
            "error"
        );
    } finally {
        persistenciaEmAndamento = false;

        definirEditorAlunosOcupado(
            false
        );
    }
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
 * Converte erros técnicos de persistência em mensagens adequadas
 * para a interface administrativa.
 *
 * @param {unknown} erro
 * @returns {string}
 */
function obterMensagemErroPersistencia(
    erro
) {
    const codigo =
        erro &&
        typeof erro === "object" &&
        typeof erro.code === "string"
            ? erro.code
            : "";

    if (codigo === "permission-denied") {
        return (
            "A alteração foi recusada pelas regras de segurança. " +
            "Nenhum dado foi gravado."
        );
    }

    if (
        codigo === "unavailable" ||
        codigo === "network-request-failed"
    ) {
        return (
            "Não foi possível concluir a alteração. " +
            "Verifique sua conexão e tente novamente."
        );
    }

    return (
        "Não foi possível salvar a alteração administrativa. " +
        "Nenhum dado foi confirmado."
    );
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
