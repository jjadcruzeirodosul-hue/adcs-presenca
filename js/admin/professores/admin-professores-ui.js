/**
 * ============================================================
 * ADCS Presença
 * admin-professores-ui.js
 * ------------------------------------------------------------
 * Responsável exclusivamente pela interface da Gestão
 * Administrativa de Professores.
 *
 * Responsabilidades neste incremento:
 * - inicialização estrutural da interface;
 * - estados de carregamento, lista vazia e erro;
 * - renderização da listagem administrativa;
 * - apresentação do professor selecionado.
 *
 * Não conhece Firebase, Firestore, sessão ou Security Rules.
 *
 * Conforme DEVSTD-001.
 * ============================================================
 */

"use strict";

let moduloInicializado = false;
let callbackSelecionarProfessor = null;
let callbackVoltarLista = null;

/**
 * Inicializa a interface administrativa de professores.
 *
 * @param {{
 *     onSelecionarProfessor?: function(string): void
 * }} callbacks
 */
export function initAdminProfessoresUI(
    {
        onSelecionarProfessor = null,
        onVoltarLista = null
    } = {}
) {
    if (moduloInicializado) {
        return;
    }

    callbackSelecionarProfessor =
        typeof onSelecionarProfessor === "function"
            ? onSelecionarProfessor
            : null;

    callbackVoltarLista =
        typeof onVoltarLista === "function"
            ? onVoltarLista
            : null;

    const elementos =
        obterElementos();

    ocultarLoading(elementos);
    ocultarLista(elementos);
    ocultarEditor(elementos);
    ocultarEstado(elementos);

    moduloInicializado = true;

    console.info(
        "[Admin][Professores][UI] Interface inicializada."
    );
}

/**
 * Exibe o estado de carregamento.
 */
export function mostrarCarregamentoProfessores() {
    const elementos =
        obterElementos();

    ocultarEstado(elementos);
    ocultarLista(elementos);
    ocultarEditor(elementos);

    elementos.loading.hidden = false;
}

/**
 * Exibe o estado de lista vazia.
 */
export function mostrarListaVaziaProfessores() {
    const elementos =
        obterElementos();

    ocultarLoading(elementos);
    ocultarEditor(elementos);
    ocultarEstado(elementos);

    elementos.lista.replaceChildren();

    const mensagem =
        document.createElement("p");

    mensagem.className =
        "admin-students-list__empty";

    mensagem.textContent =
        "Nenhum professor cadastrado.";

    elementos.lista.appendChild(
        mensagem
    );

    elementos.lista.hidden = false;
}

/**
 * Exibe erro geral do módulo.
 *
 * @param {string} mensagem
 */
export function mostrarErroProfessores(
    mensagem
) {
    mostrarEstadoProfessores(
        mensagem,
        "error"
    );
}

/**
 * Renderiza a listagem administrativa.
 *
 * @param {Object[]} professores
 */
export function mostrarListaProfessores(
    professores
) {
    const elementos =
        obterElementos();

    ocultarLoading(elementos);
    ocultarEstado(elementos);
    ocultarEditor(elementos);

    elementos.lista.replaceChildren();

    if (
        !Array.isArray(professores) ||
        professores.length === 0
    ) {
        mostrarListaVaziaProfessores();
        return;
    }

    const fragmento =
        document.createDocumentFragment();

    professores.forEach((professor) => {
        fragmento.appendChild(
            criarItemProfessor(professor)
        );
    });

    elementos.lista.appendChild(
        fragmento
    );

    elementos.lista.hidden = false;
}

/**
 * Renderiza os dados do professor selecionado.
 *
 * @param {Object} professor
 */
export function mostrarProfessorSelecionado(
    professor
) {
    const elementos =
        obterElementos();

    ocultarLoading(elementos);
    ocultarEstado(elementos);
    ocultarLista(elementos);

    elementos.editor.replaceChildren(
        criarDetalheProfessor(professor)
    );

    elementos.editor.hidden = false;
}

/**
 * Exibe uma mensagem geral do módulo.
 *
 * @param {string} texto
 * @param {"info" | "success" | "warning" | "error"} tipo
 */
export function mostrarEstadoProfessores(
    texto,
    tipo = "info"
) {
    const elementos =
        obterElementos();

    ocultarLoading(elementos);
    ocultarLista(elementos);
    ocultarEditor(elementos);

    elementos.estado.textContent =
        texto;

    elementos.estado.className =
        `feedback feedback--${tipo}`;

    elementos.estado.hidden = false;
}

/**
 * Cria item clicável da listagem.
 *
 * @param {Object} professor
 * @returns {HTMLButtonElement}
 */
function criarItemProfessor(professor) {
    const botao =
        document.createElement("button");

    botao.type =
        "button";

    botao.className =
        "admin-students-list__item";

    const nome =
        document.createElement("strong");

    nome.textContent =
        professor.nome ||
        "Professor sem nome";

    const detalhes =
        document.createElement("span");

    detalhes.textContent =
        professor.ativo === true
            ? "Ativo"
            : "Inativo";

    botao.append(
        nome,
        detalhes
    );

    botao.addEventListener(
        "click",
        () => {
            if (callbackSelecionarProfessor) {
                callbackSelecionarProfessor(
                    professor.id
                );
            }
        }
    );

    return botao;
}

/**
 * Cria o detalhe do professor selecionado.
 *
 * Não expõe campos técnicos administrativos.
 *
 * @param {Object} professor
 * @returns {HTMLElement}
 */
function criarDetalheProfessor(
    professor
) {
    const detalhe =
        document.createElement("section");

    detalhe.className =
        "admin-student-detail";

    const titulo =
        document.createElement("h4");

    titulo.className =
        "admin-student-detail__title";

    titulo.textContent =
        professor.nome ||
        "Professor sem nome";

    detalhe.append(
        titulo,
        criarCampoDetalhe(
            "Status",
            professor.ativo === true
                ? "Ativo"
                : "Inativo"
        )
    );

    const acoes =
        document.createElement("div");

    acoes.className =
        "admin-student-detail__actions";

    const botaoVoltar =
        document.createElement("button");

    botaoVoltar.type =
        "button";

    botaoVoltar.className =
        "button button--secondary";

    botaoVoltar.textContent =
        "Voltar para a lista";

    botaoVoltar.addEventListener(
        "click",
        () => {
            if (callbackVoltarLista) {
                callbackVoltarLista();
            }
        }
    );

    acoes.appendChild(
        botaoVoltar
    );

    detalhe.appendChild(
        acoes
    );

    return detalhe;
}

/**
 * Cria uma linha de detalhe.
 *
 * @param {string} rotulo
 * @param {string} valor
 * @returns {HTMLParagraphElement}
 */
function criarCampoDetalhe(
    rotulo,
    valor
) {
    const linha =
        document.createElement("p");

    linha.className =
        "admin-student-detail__row";

    const label =
        document.createElement("strong");

    label.textContent =
        `${rotulo}: `;

    const conteudo =
        document.createElement("span");

    conteudo.textContent =
        valor;

    linha.append(
        label,
        conteudo
    );

    return linha;
}

/**
 * Obtém e valida os elementos estruturais do módulo.
 *
 * @returns {{
 *     estado: HTMLElement,
 *     loading: HTMLElement,
 *     lista: HTMLElement,
 *     editor: HTMLElement
 * }}
 */
function obterElementos() {
    const estado =
        document.getElementById(
            "estadoAdminProfessores"
        );

    const loading =
        document.getElementById(
            "loadingAdminProfessores"
        );

    const lista =
        document.getElementById(
            "listaAdminProfessores"
        );

    const editor =
        document.getElementById(
            "editorAdminProfessores"
        );

    if (!estado) {
        throw new Error(
            'O elemento "#estadoAdminProfessores" não foi encontrado.'
        );
    }

    if (!loading) {
        throw new Error(
            'O elemento "#loadingAdminProfessores" não foi encontrado.'
        );
    }

    if (!lista) {
        throw new Error(
            'O elemento "#listaAdminProfessores" não foi encontrado.'
        );
    }

    if (!editor) {
        throw new Error(
            'O elemento "#editorAdminProfessores" não foi encontrado.'
        );
    }

    return {
        estado,
        loading,
        lista,
        editor
    };
}

function ocultarEstado(elementos) {
    elementos.estado.hidden = true;
}

function ocultarLoading(elementos) {
    elementos.loading.hidden = true;
}

function ocultarLista(elementos) {
    elementos.lista.hidden = true;
}

function ocultarEditor(elementos) {
    elementos.editor.hidden = true;
}