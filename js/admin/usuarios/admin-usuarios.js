/**
 * ============================================================
 * ADCS Presença
 * admin-usuarios.js
 * ------------------------------------------------------------
 * Orquestrador do módulo administrativo de Gestão de Usuários.
 *
 * Responsabilidades:
 * - listagem e consulta de usuários;
 * - edição administrativa de ativo/perfis;
 * - validações funcionais e proteção S4-DEC-003;
 * - montagem da operação administrativa;
 * - coordenação da persistência atômica;
 * - atualização da interface após o commit.
 *
 * A persistência efetiva é delegada à camada de serviço.
 *
 * Conforme DEVSTD-001.
 * ============================================================
 */

"use strict";

import {
    obterUsuarioAutenticado
} from "../../auth/session.js";

import {
    listarUsuariosAdministrativos,
    obterUsuarioAdministrativo,
    persistirOperacaoUsuario
} from "./admin-usuarios-service.js";

import {
    initAdminUsuariosUI,
    limparUsuarioConsultado,
    mostrarEstadoUsuarios,
    mostrarListaUsuarios,
    mostrarLoadingUsuarios,
    mostrarUsuarioConsultado
} from "./admin-usuarios-ui.js";

import {
    montarOperacaoUsuario
} from "./admin-usuarios-operation.js";

let moduloInicializado = false;
let carregamentoEmAndamento = false;
let usuarioSelecionado = null;
let persistenciaEmAndamento = false;

/**
 * Inicializa o módulo administrativo de usuários.
 */
export function initAdminUsuarios() {
    if (moduloInicializado) {
        return;
    }

    initAdminUsuariosUI({
        onSelecionar: (uid) => {
            void consultarUsuario(uid);
        },

        onPrepararAlteracao: (edicao) => {
            salvarAlteracaoAdministrativa(edicao);
        },

        onCancelarEdicao: () => {
            cancelarEdicaoLocal();
        }
    });

    moduloInicializado = true;

    console.info(
        "[Admin][Usuários] Módulo inicializado."
    );
}

/**
 * Carrega a listagem administrativa de usuários.
 *
 * Deve ser chamada somente depois de o contexto administrativo
 * ter sido autorizado pelo RBAC.
 *
 * @returns {Promise<void>}
 */
export async function carregarUsuariosAdministrativos() {
    if (carregamentoEmAndamento) {
        return;
    }

    carregamentoEmAndamento = true;
    usuarioSelecionado = null;

    mostrarLoadingUsuarios();
    limparUsuarioConsultado();

    try {
        const usuarios =
            await listarUsuariosAdministrativos();

        mostrarListaUsuarios(usuarios);

        console.info(
            "[Admin][Usuários] Listagem carregada.",
            {
                quantidade: usuarios.length
            }
        );
    } catch (erro) {
        console.error(
            "[Admin][Usuários] Falha ao carregar listagem:",
            erro
        );

        mostrarEstadoUsuarios(
            obterMensagemErroLeitura(erro),
            "error"
        );
    } finally {
        carregamentoEmAndamento = false;
    }
}

/**
 * Consulta individual de usuário.
 *
 * @param {string} uid
 * @returns {Promise<void>}
 */
async function consultarUsuario(uid) {
    try {
        const usuario =
            await obterUsuarioAdministrativo(uid);

        if (!usuario) {
            usuarioSelecionado = null;

            mostrarEstadoUsuarios(
                "O usuário selecionado não foi encontrado.",
                "warning"
            );

            limparUsuarioConsultado();

            return;
        }

        usuarioSelecionado =
            normalizarUsuarioParaEdicao(usuario);

        const usuarioAutenticado =
            obterUsuarioAutenticado();

        const ehProprioUsuario =
            usuarioAutenticado?.uid ===
            usuarioSelecionado.uid;

        mostrarUsuarioConsultado(
            usuarioSelecionado,
            {
                ehProprioUsuario
            }
        );

        console.info(
            "[Admin][Usuários] Usuário consultado.",
            {
                uid,
                ehProprioUsuario
            }
        );
    } catch (erro) {
        console.error(
            "[Admin][Usuários] Falha ao consultar usuário:",
            erro
        );

        mostrarEstadoUsuarios(
            obterMensagemErroLeitura(erro),
            "error"
        );
    }
}

/**
 * Valida, monta e persiste atomicamente uma alteração
 * administrativa de usuário.
 *
 * @param {{
 *     ativo: boolean,
 *     perfis: string[]
 * }} edicao
 *
 * @returns {Promise<void>}
 */
async function salvarAlteracaoAdministrativa(edicao) {
    if (persistenciaEmAndamento) {
        return;
    }

    if (!usuarioSelecionado) {
        mostrarEstadoUsuarios(
            "Selecione um usuário antes de realizar uma alteração.",
            "warning"
        );

        return;
    }

    const resultadoValidacao =
        validarEdicaoLocal(
            usuarioSelecionado,
            edicao
        );

    if (!resultadoValidacao.valido) {
        mostrarEstadoUsuarios(
            resultadoValidacao.mensagem,
            "warning"
        );

        return;
    }

    let operacao;

    try {
        operacao =
            montarOperacaoUsuario(
                usuarioSelecionado,
                edicao
            );
    } catch (erro) {
        console.error(
            "[Admin][Usuários] Falha ao montar operação administrativa:",
            erro
        );

        mostrarEstadoUsuarios(
            "Não foi possível preparar a operação administrativa.",
            "error"
        );

        return;
    }

    if (!operacao) {
        mostrarEstadoUsuarios(
            "Não existem alterações funcionais para este usuário.",
            "info"
        );

        return;
    }

    const usuarioAutenticado =
        obterUsuarioAutenticado();

    if (!usuarioAutenticado?.uid) {
        mostrarEstadoUsuarios(
            "A sessão autenticada não está disponível.",
            "error"
        );

        return;
    }

    persistenciaEmAndamento = true;

    mostrarEstadoUsuarios(
        "Salvando alteração administrativa...",
        "info"
    );

    console.info(
        "[Admin][Usuários] Persistência administrativa iniciada.",
        {
            operacaoId:
                operacao.operacaoId,

            eventoId:
                operacao.eventoId,

            usuarioId:
                operacao.usuarioId,

            acao:
                operacao.acao,

            camposAlterados:
                operacao.camposAlterados
        }
    );

    try {
        await persistirOperacaoUsuario(
            operacao,
            usuarioAutenticado.uid
        );

        console.info(
            "[Admin][Usuários] Operação administrativa persistida.",
            {
                operacaoId:
                    operacao.operacaoId,

                eventoId:
                    operacao.eventoId,

                usuarioId:
                    operacao.usuarioId,

                acao:
                    operacao.acao
            }
        );

        mostrarEstadoUsuarios(
            "Alteração administrativa salva com sucesso.",
            "success"
        );

        /*
         * Reconsulta obrigatória:
         * o estado local passa a refletir novamente a fonte
         * persistida no Firestore.
         */
        await consultarUsuario(
            operacao.usuarioId
        );

        /*
         * Atualiza também a listagem para refletir imediatamente
         * ativo/perfis persistidos.
         */
        const usuarios =
            await listarUsuariosAdministrativos();

        mostrarListaUsuarios(usuarios);

        /*
         * mostrarListaUsuarios oculta o editor durante a
         * renderização. Reabrimos o usuário já reconsultado.
         */
        if (usuarioSelecionado) {
            const usuarioAtual =
                obterUsuarioAutenticado();

            mostrarUsuarioConsultado(
                usuarioSelecionado,
                {
                    ehProprioUsuario:
                        usuarioAtual?.uid ===
                        usuarioSelecionado.uid
                }
            );
        }

        mostrarEstadoUsuarios(
            "Alteração administrativa salva com sucesso.",
            "success"
        );
    } catch (erro) {
        console.error(
            "[Admin][Usuários] Falha ao persistir operação administrativa:",
            erro
        );

        mostrarEstadoUsuarios(
            obterMensagemErroPersistencia(erro),
            "error"
        );
    } finally {
        persistenciaEmAndamento = false;
    }
}

/**
 * Restaura a edição ao estado originalmente consultado.
 */
function cancelarEdicaoLocal() {
    if (!usuarioSelecionado) {
        return;
    }

    const usuarioAutenticado =
        obterUsuarioAutenticado();

    mostrarUsuarioConsultado(
        usuarioSelecionado,
        {
            ehProprioUsuario:
                usuarioAutenticado?.uid ===
                usuarioSelecionado.uid
        }
    );

    mostrarEstadoUsuarios(
        "Alterações locais descartadas.",
        "info"
    );

    console.info(
        "[Admin][Usuários] Edição local restaurada.",
        {
            uid: usuarioSelecionado.uid
        }
    );
}

/**
 * Valida a edição conforme os contratos funcionais vigentes.
 *
 * @param {{
 *     uid: string,
 *     ativo: boolean,
 *     perfis: string[]
 * }} original
 * @param {{
 *     ativo: boolean,
 *     perfis: string[]
 * }} edicao
 *
 * @returns {{
 *     valido: boolean,
 *     mensagem: string
 * }}
 */
function validarEdicaoLocal(
    original,
    edicao
) {
    if (typeof edicao.ativo !== "boolean") {
        return {
            valido: false,
            mensagem:
                "O estado operacional informado é inválido."
        };
    }

    if (!Array.isArray(edicao.perfis)) {
        return {
            valido: false,
            mensagem:
                "A configuração de perfis é inválida."
        };
    }

    const perfisPermitidos = new Set([
        "ADMIN",
        "OPERADOR"
    ]);

    const perfisValidos =
        edicao.perfis.every(
            (perfil) =>
                perfisPermitidos.has(perfil)
        );

    const semDuplicidade =
        new Set(edicao.perfis).size ===
        edicao.perfis.length;

    if (
        !perfisValidos ||
        !semDuplicidade
    ) {
        return {
            valido: false,
            mensagem:
                "Existem perfis inválidos na configuração."
        };
    }

    if (
        edicao.ativo === true &&
        edicao.perfis.length === 0
    ) {
        return {
            valido: false,
            mensagem:
                "Um usuário ativo deve possuir pelo menos um perfil."
        };
    }

    const usuarioAutenticado =
        obterUsuarioAutenticado();

    const editandoProprioUsuario =
        usuarioAutenticado?.uid === original.uid;

    if (
        editandoProprioUsuario &&
        edicao.ativo === false
    ) {
        return {
            valido: false,
            mensagem:
                "O ADMIN autenticado não pode desativar a própria conta."
        };
    }

    if (
        editandoProprioUsuario &&
        !edicao.perfis.includes("ADMIN")
    ) {
        return {
            valido: false,
            mensagem:
                "O ADMIN autenticado não pode remover de si próprio o perfil ADMIN."
        };
    }

    return {
        valido: true,
        mensagem: ""
    };
}

/**
 * Normaliza os campos necessários para a edição.
 *
 * @param {Object} usuario
 * @returns {{
 *     uid: string,
 *     ativo: boolean,
 *     perfis: string[]
 * }}
 */
function normalizarUsuarioParaEdicao(usuario) {
    return {
        ...usuario,

        uid: String(usuario.uid || ""),

        ativo:
            usuario.ativo === true,

        perfis:
            Array.isArray(usuario.perfis)
                ? [...usuario.perfis]
                : []
    };
}

/**
 * Traduz erros conhecidos da persistência administrativa.
 *
 * @param {unknown} erro
 * @returns {string}
 */
function obterMensagemErroPersistencia(erro) {
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
 * Traduz erros conhecidos de leitura.
 *
 * @param {unknown} erro
 * @returns {string}
 */
function obterMensagemErroLeitura(erro) {
    const codigo =
        erro &&
        typeof erro === "object" &&
        typeof erro.code === "string"
            ? erro.code
            : "";

    if (codigo === "permission-denied") {
        return (
            "Você não possui autorização para consultar " +
            "os usuários."
        );
    }

    if (
        codigo === "unavailable" ||
        codigo === "network-request-failed"
    ) {
        return (
            "Não foi possível consultar os usuários. " +
            "Verifique sua conexão e tente novamente."
        );
    }

    return (
        "Não foi possível carregar os usuários. " +
        "Tente novamente."
    );
}