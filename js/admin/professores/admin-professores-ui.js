/**
 * ============================================================
 * ADCS PresenÃ§a
 * admin-professores-ui.js
 * ------------------------------------------------------------
 * ResponsÃ¡vel exclusivamente pela interface da GestÃ£o
 * Administrativa de Professores.
 *
 * Responsabilidades neste incremento:
 * - inicializaÃ§Ã£o estrutural da interface;
 * - estados de carregamento, lista vazia e erro;
 * - renderizaÃ§Ã£o da listagem administrativa;
 * - apresentaÃ§Ã£o do professor selecionado.
 *
 * NÃ£o conhece Firebase, Firestore, sessÃ£o ou Security Rules.
 *
 * Conforme DEVSTD-001.
 * ============================================================
 */

"use strict";

let moduloInicializado = false;
let callbackSelecionarProfessor = null;
let callbackNovoProfessor = null;
let callbackEditarProfessor = null;
let callbackPrepararNovoProfessor = null;
let callbackPrepararEdicaoProfessor = null;
let callbackCancelarEdicao = null;
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
        onNovoProfessor = null,
        onEditarProfessor = null,
        onPrepararNovoProfessor = null,
        onPrepararEdicaoProfessor = null,
        onCancelarEdicao = null,
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

    callbackNovoProfessor =
        typeof onNovoProfessor === "function"
            ? onNovoProfessor
            : null;

    callbackEditarProfessor =
        typeof onEditarProfessor === "function"
            ? onEditarProfessor
            : null;

    callbackPrepararNovoProfessor =
        typeof onPrepararNovoProfessor === "function"
            ? onPrepararNovoProfessor
            : null;

    callbackPrepararEdicaoProfessor =
        typeof onPrepararEdicaoProfessor === "function"
            ? onPrepararEdicaoProfessor
            : null;

    callbackCancelarEdicao =
        typeof onCancelarEdicao === "function"
            ? onCancelarEdicao
            : null;

    callbackVoltarLista =
        typeof onVoltarLista === "function"
            ? onVoltarLista
            : null;

    const elementos =
        obterElementos();

    elementos.editor.addEventListener(
        "submit",
        tratarSubmitEditor
    );

    elementos.editor.addEventListener(
        "click",
        tratarCliqueEditor
    );

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
 * Exibe erro geral do mÃ³dulo.
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

    const acoes =
        criarAcoesLista();

    elementos.lista.appendChild(
        acoes
    );

    if (
        !Array.isArray(professores) ||
        professores.length === 0
    ) {
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

export function mostrarFormularioNovoProfessor() {
    const elementos =
        obterElementos();

    ocultarLoading(elementos);
    ocultarEstado(elementos);
    ocultarLista(elementos);

    elementos.editor.replaceChildren(
        criarFormularioNovoProfessor()
    );

    elementos.editor.hidden = false;
}

export function mostrarFormularioEdicaoProfessor(
    professor
) {
    const elementos =
        obterElementos();

    ocultarLoading(elementos);
    ocultarEstado(elementos);
    ocultarLista(elementos);

    elementos.editor.replaceChildren(
        criarFormularioEdicaoProfessor(
            professor
        )
    );

    elementos.editor.hidden = false;
}

/**
 * Exibe uma mensagem geral do mÃ³dulo.
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
 * Alterna o estado ocupado do editor administrativo.
 *
 * Durante uma persistência:
 * - bloqueia campos editáveis;
 * - bloqueia ações do formulário;
 * - restaura o estado anterior dos controles ao finalizar.
 *
 * @param {boolean} ocupado
 */
export function definirEditorProfessoresOcupado(
    ocupado
) {
    const elementos =
        obterElementos();

    const controles =
        elementos.editor.querySelectorAll(
            "input, select, textarea, button"
        );

    controles.forEach((controle) => {
        if (ocupado === true) {
            controle.dataset.disabledAntesPersistencia =
                controle.disabled
                    ? "true"
                    : "false";

            controle.disabled = true;
            return;
        }

        const estavaDesabilitado =
            controle.dataset.disabledAntesPersistencia ===
            "true";

        controle.disabled =
            estavaDesabilitado;

        delete controle.dataset
            .disabledAntesPersistencia;
    });

    elementos.editor.setAttribute(
        "aria-busy",
        ocupado === true
            ? "true"
            : "false"
    );
}

function criarAcoesLista() {
    const acoes =
        document.createElement("div");

    acoes.className =
        "admin-user-editor__actions";

    const novo =
        document.createElement("button");

    novo.type =
        "button";

    novo.className =
        "button button--primary";

    novo.textContent =
        "Novo professor";

    novo.addEventListener(
        "click",
        () => {
            if (callbackNovoProfessor) {
                callbackNovoProfessor();
            }
        }
    );

    acoes.appendChild(
        novo
    );

    return acoes;
}

function criarFormularioNovoProfessor() {
    const formulario =
        document.createElement("form");

    formulario.className =
        "admin-student-form";

    formulario.dataset.professorEditor =
        "novo";

    const titulo =
        document.createElement("h4");

    titulo.className =
        "admin-student-detail__title";

    titulo.textContent =
        "Novo professor";

    const campoNome =
        criarCampoTexto({
            nome: "nome",
            rotulo: "Nome",
            valor: "",
            obrigatorio: true,
            autocomplete: "name"
        });

    const estadoInicial =
        criarCampoDetalhe(
            "Status inicial",
            "Ativo"
        );

    const acoes =
        criarAcoesFormulario(
			"Cadastrar professor"
        );

    formulario.append(
        titulo,
        campoNome,
        estadoInicial,
        acoes
    );

    return formulario;
}

function criarFormularioEdicaoProfessor(
    professor
) {
    const formulario =
        document.createElement("form");

    formulario.className =
        "admin-student-form";

    formulario.dataset.professorEditor =
        "edicao";

    const titulo =
        document.createElement("h4");

    titulo.className =
        "admin-student-detail__title";

    titulo.textContent =
        "Editar professor";

    const campoNome =
        criarCampoTexto({
            nome: "nome",
            rotulo: "Nome",
            valor:
                professor.nome || "",
            obrigatorio: true,
            autocomplete: "name"
        });

    const acoes =
        criarAcoesFormulario(
			"Salvar alterações"
        );

    formulario.append(
        titulo,
        campoNome,
        acoes
    );

    return formulario;
}

function criarCampoTexto(
    {
        nome,
        rotulo,
        valor,
        obrigatorio = false,
        autocomplete = "off"
    }
) {
    const campo =
        document.createElement("div");

    campo.className =
        "form-field";

    const label =
        document.createElement("label");

    label.className =
        "form-field__label";

    label.htmlFor =
        `adminProfessor_${nome}`;

    label.textContent =
        rotulo;

    const input =
        document.createElement("input");

    input.id =
        `adminProfessor_${nome}`;

    input.name =
        nome;

    input.type =
        "text";

    input.className =
        "form-field__control";

    input.value =
        String(valor || "");

    input.required =
        obrigatorio;

    input.autocomplete =
        autocomplete;

    campo.append(
        label,
        input
    );

    return campo;
}

function criarAcoesFormulario(
    textoPrincipal
) {
    const acoes =
        document.createElement("div");

    acoes.className =
        "admin-user-editor__actions";

    const preparar =
        document.createElement("button");

    preparar.type =
        "submit";

    preparar.className =
        "button button--primary";

    preparar.textContent =
        textoPrincipal;

    const cancelar =
        document.createElement("button");

    cancelar.type =
        "button";

    cancelar.className =
        "button button--secondary";

    cancelar.dataset.acaoEditor =
        "cancelar";

    cancelar.textContent =
        "Cancelar";

    acoes.append(
        preparar,
        cancelar
    );

    return acoes;
}

/**
 * Cria item clicÃ¡vel da listagem.
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
 * NÃ£o expÃµe campos tÃ©cnicos administrativos.
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

    const botaoEditar =
        document.createElement("button");

    botaoEditar.type =
        "button";

    botaoEditar.className =
        "button button--primary";

    botaoEditar.dataset.acaoEditor =
        "editar";

    botaoEditar.textContent =
        "Editar";

    const botaoVoltar =
        document.createElement("button");

    botaoVoltar.type =
        "button";

    botaoVoltar.className =
        "button button--secondary";

    botaoVoltar.textContent =
        "Voltar para a lista";

    botaoVoltar.dataset.acaoEditor =
        "voltar";

    acoes.append(
        botaoEditar,
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

function tratarSubmitEditor(evento) {
    const formulario =
        evento.target;

    if (
        !(formulario instanceof HTMLFormElement)
    ) {
        return;
    }

    const tipo =
        formulario.dataset.professorEditor;

    if (
        tipo !== "novo" &&
        tipo !== "edicao"
    ) {
        return;
    }

    evento.preventDefault();

    const nome =
        formulario.querySelector(
            'input[name="nome"]'
        );

    if (!(nome instanceof HTMLInputElement)) {
        return;
    }

    const nomeNormalizado =
        nome.value.trim();

    if (nomeNormalizado === "") {
        nome.focus();
        return;
    }

    if (
        tipo === "novo" &&
        callbackPrepararNovoProfessor
    ) {
        callbackPrepararNovoProfessor({
            nome: nomeNormalizado
        });

        return;
    }

	if (
		tipo === "edicao" &&
		callbackPrepararEdicaoProfessor
	) {
		callbackPrepararEdicaoProfessor({
			nome: nomeNormalizado
		});
	}
}

function tratarCliqueEditor(evento) {
    const alvo =
        evento.target instanceof Element
            ? evento.target.closest(
                "[data-acao-editor]"
            )
            : null;

    if (!(alvo instanceof HTMLButtonElement)) {
        return;
    }

    const acao =
        alvo.dataset.acaoEditor;

    if (
        acao === "editar" &&
        callbackEditarProfessor
    ) {
        callbackEditarProfessor();
        return;
    }

    if (
        acao === "voltar" &&
        callbackVoltarLista
    ) {
        callbackVoltarLista();
        return;
    }

    if (
        acao === "cancelar" &&
        callbackCancelarEdicao
    ) {
        callbackCancelarEdicao();
    }
}

/**
 * ObtÃ©m e valida os elementos estruturais do mÃ³dulo.
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
            'O elemento "#estadoAdminProfessores" nÃ£o foi encontrado.'
        );
    }

    if (!loading) {
        throw new Error(
            'O elemento "#loadingAdminProfessores" nÃ£o foi encontrado.'
        );
    }

    if (!lista) {
        throw new Error(
            'O elemento "#listaAdminProfessores" nÃ£o foi encontrado.'
        );
    }

    if (!editor) {
        throw new Error(
            'O elemento "#editorAdminProfessores" nÃ£o foi encontrado.'
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
