/**
 * ============================================================
 * ADCS Presença
 * admin-alunos-ui.js
 * ------------------------------------------------------------
 * Responsável exclusivamente pela interface da Gestão
 * Administrativa de Alunos.
 *
 * Responsabilidades neste incremento:
 * - estados visuais do módulo;
 * - listagem e consulta de alunos;
 * - formulário local de criação;
 * - formulário local de edição;
 * - coleta e validação estrutural de dados locais.
 *
 * Não conhece Firebase, Firestore, sessão ou Security Rules.
 *
 * Conforme DEVSTD-001.
 * ============================================================
 */

"use strict";

let moduloInicializado = false;

let callbackSelecionarAluno = null;
let callbackNovoAluno = null;
let callbackEditarAluno = null;
let callbackPrepararNovoAluno = null;
let callbackPrepararEdicaoAluno = null;
let callbackCancelarEdicao = null;
let callbackVoltarLista = null;

/**
 * Inicializa a interface administrativa de alunos.
 *
 * @param {{
 *     onSelecionarAluno?: (alunoId: string) => void,
 *     onNovoAluno?: () => void,
 *     onEditarAluno?: () => void,
 *     onPrepararNovoAluno?: (
 *         dados: {
 *             nome: string,
 *             faixa: string
 *         }
 *     ) => void,
 *     onPrepararEdicaoAluno?: (
 *         dados: {
 *             nome: string,
 *             faixa: string,
 *             ativo: boolean
 *         }
 *     ) => void,
 *     onCancelarEdicao?: () => void,
 *     onVoltarLista?: () => void
 * }} opcoes
 */
export function initAdminAlunosUI(
    {
        onSelecionarAluno = null,
        onNovoAluno = null,
        onEditarAluno = null,
        onPrepararNovoAluno = null,
        onPrepararEdicaoAluno = null,
        onCancelarEdicao = null,
        onVoltarLista = null
    } = {}
) {
    if (moduloInicializado) {
        return;
    }

    callbackSelecionarAluno =
        typeof onSelecionarAluno === "function"
            ? onSelecionarAluno
            : null;

    callbackNovoAluno =
        typeof onNovoAluno === "function"
            ? onNovoAluno
            : null;

    callbackEditarAluno =
        typeof onEditarAluno === "function"
            ? onEditarAluno
            : null;

    callbackPrepararNovoAluno =
        typeof onPrepararNovoAluno === "function"
            ? onPrepararNovoAluno
            : null;

    callbackPrepararEdicaoAluno =
        typeof onPrepararEdicaoAluno === "function"
            ? onPrepararEdicaoAluno
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
}

/**
 * Exibe o estado de carregamento.
 */
export function mostrarCarregamentoAlunos() {
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
export function mostrarListaVaziaAlunos() {
    const elementos =
        obterElementos();

    ocultarLoading(elementos);
    ocultarLista(elementos);
    ocultarEditor(elementos);

    const acoes =
        criarAcoesLista();

    elementos.lista.replaceChildren(
        acoes
    );

    elementos.lista.hidden = false;

    mostrarEstadoAlunos(
        "Nenhum aluno cadastrado foi encontrado.",
        "info"
    );
}

/**
 * Exibe mensagem de erro.
 *
 * @param {string} mensagem
 */
export function mostrarErroAlunos(mensagem) {
    const elementos =
        obterElementos();

    ocultarLoading(elementos);
    ocultarLista(elementos);
    ocultarEditor(elementos);

    mostrarEstadoAlunos(
        mensagem,
        "error"
    );
}

/**
 * Renderiza a listagem administrativa.
 *
 * @param {Object[]} alunos
 */
export function mostrarListaAlunos(alunos) {
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
        !Array.isArray(alunos) ||
        alunos.length === 0
    ) {
        mostrarListaVaziaAlunos();
        return;
    }

    const fragmento =
        document.createDocumentFragment();

    alunos.forEach((aluno) => {
        fragmento.appendChild(
            criarItemAluno(aluno)
        );
    });

    elementos.lista.appendChild(fragmento);
    elementos.lista.hidden = false;
}

/**
 * Renderiza os dados do aluno selecionado.
 *
 * @param {Object} aluno
 */
export function mostrarAlunoSelecionado(aluno) {
    const elementos =
        obterElementos();

    ocultarLoading(elementos);
    ocultarEstado(elementos);
    ocultarLista(elementos);

    elementos.editor.replaceChildren(
        criarDetalheAluno(aluno)
    );

    elementos.editor.hidden = false;
}

/**
 * Mostra formulário local de criação.
 */
export function mostrarFormularioNovoAluno() {
    const elementos =
        obterElementos();

    ocultarLoading(elementos);
    ocultarEstado(elementos);
    ocultarLista(elementos);

    elementos.editor.replaceChildren(
        criarFormularioNovoAluno()
    );

    elementos.editor.hidden = false;
}

/**
 * Mostra formulário local de edição.
 *
 * @param {Object} aluno
 */
export function mostrarFormularioEdicaoAluno(
    aluno
) {
    const elementos =
        obterElementos();

    ocultarLoading(elementos);
    ocultarEstado(elementos);
    ocultarLista(elementos);

    elementos.editor.replaceChildren(
        criarFormularioEdicaoAluno(
            aluno
        )
    );

    elementos.editor.hidden = false;
}

/**
 * Exibe uma mensagem geral do módulo.
 *
 * @param {string} texto
 * @param {"info" | "success" | "warning" | "error"} tipo
 */
export function mostrarEstadoAlunos(
    texto,
    tipo = "info"
) {
    const elementos =
        obterElementos();

    ocultarLoading(elementos);

    elementos.estado.textContent = texto;
    elementos.estado.className =
        `feedback feedback--${tipo}`;

    elementos.estado.hidden = false;
}

/**
 * Cria ações superiores da listagem.
 *
 * @returns {HTMLElement}
 */
function criarAcoesLista() {
    const acoes =
        document.createElement("div");

    acoes.className =
        "admin-students-list__actions";

    const botaoNovo =
        document.createElement("button");

    botaoNovo.type = "button";
    botaoNovo.className =
        "button button--primary";

    botaoNovo.textContent =
        "Novo aluno";

    botaoNovo.addEventListener(
        "click",
        () => {
            if (callbackNovoAluno) {
                callbackNovoAluno();
            }
        }
    );

    acoes.appendChild(
        botaoNovo
    );

    return acoes;
}

/**
 * Cria o detalhe do aluno selecionado.
 *
 * @param {Object} aluno
 * @returns {HTMLElement}
 */
function criarDetalheAluno(aluno) {
    const detalhe =
        document.createElement("section");

    detalhe.className =
        "admin-student-detail";

    const titulo =
        document.createElement("h4");

    titulo.className =
        "admin-student-detail__title";

    titulo.textContent =
        aluno.nome || "Aluno sem nome";

    detalhe.append(
        titulo,
        criarCampoDetalhe(
            "Matrícula",
            aluno.matricula || "Não informada"
        ),
        criarCampoDetalhe(
            "Faixa",
            aluno.faixa || "Não informada"
        ),
        criarCampoDetalhe(
            "Status",
            aluno.ativo === true
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

    botaoEditar.type = "button";
    botaoEditar.className =
        "button button--primary";

    botaoEditar.dataset.acaoEditor =
        "editar";

    botaoEditar.textContent =
        "Editar";

    const botaoVoltar =
        document.createElement("button");

    botaoVoltar.type = "button";
    botaoVoltar.className =
        "button button--secondary";

    botaoVoltar.dataset.acaoEditor =
        "voltar";

    botaoVoltar.textContent =
        "Voltar para a lista";

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
 * Cria formulário local para novo aluno.
 *
 * A matrícula não faz parte do formulário porque será
 * definida futuramente pela transação autorizada.
 *
 * @returns {HTMLFormElement}
 */
function criarFormularioNovoAluno() {
    const formulario =
        document.createElement("form");

    formulario.className =
        "admin-student-form";

    formulario.dataset.alunoEditor =
        "novo";

    const titulo =
        document.createElement("h4");

    titulo.className =
        "admin-student-detail__title";

    titulo.textContent =
        "Novo aluno";

    const ajuda =
        document.createElement("p");

    ajuda.className =
        "form-field__help";

    ajuda.textContent =
        "A matrícula será gerada automaticamente " +
        "quando o cadastro for persistido.";

    const campoNome =
        criarCampoTexto({
            nome: "nome",
            rotulo: "Nome",
            valor: "",
            obrigatorio: true,
            autocomplete: "name"
        });

    const campoFaixa =
        criarCampoTexto({
            nome: "faixa",
            rotulo: "Faixa",
            valor: "",
            obrigatorio: true,
            autocomplete: "off"
        });

    const estadoInicial =
        criarCampoDetalhe(
            "Status inicial",
            "Ativo"
        );

    const acoes =
        criarAcoesFormulario(
            "Preparar cadastro"
        );

    formulario.append(
        titulo,
        ajuda,
        campoNome,
        campoFaixa,
        estadoInicial,
        acoes
    );

    return formulario;
}

/**
 * Cria formulário local de edição.
 *
 * @param {Object} aluno
 * @returns {HTMLFormElement}
 */
function criarFormularioEdicaoAluno(
    aluno
) {
    const formulario =
        document.createElement("form");

    formulario.className =
        "admin-student-form";

    formulario.dataset.alunoEditor =
        "edicao";

    const titulo =
        document.createElement("h4");

    titulo.className =
        "admin-student-detail__title";

    titulo.textContent =
        "Editar aluno";

    const matricula =
        criarCampoTexto({
            nome: "matricula",
            rotulo: "Matrícula",
            valor:
                aluno.matricula || "",
            obrigatorio: false,
            desabilitado: true
        });

    const ajudaMatricula =
        document.createElement("p");

    ajudaMatricula.className =
        "form-field__help";

    ajudaMatricula.textContent =
        "A matrícula é protegida e não pode ser alterada.";

    const campoNome =
        criarCampoTexto({
            nome: "nome",
            rotulo: "Nome",
            valor:
                aluno.nome || "",
            obrigatorio: true,
            autocomplete: "name"
        });

    const campoFaixa =
        criarCampoTexto({
            nome: "faixa",
            rotulo: "Faixa",
            valor:
                aluno.faixa || "",
            obrigatorio: true,
            autocomplete: "off"
        });

    const campoAtivo =
        criarCampoAtivo(
            aluno.ativo === true
        );

    const acoes =
        criarAcoesFormulario(
            "Preparar alterações"
        );

    formulario.append(
        titulo,
        matricula,
        ajudaMatricula,
        campoNome,
        campoFaixa,
        campoAtivo,
        acoes
    );

    return formulario;
}

/**
 * Cria campo textual reutilizável.
 *
 * @param {{
 *     nome: string,
 *     rotulo: string,
 *     valor: string,
 *     obrigatorio?: boolean,
 *     desabilitado?: boolean,
 *     autocomplete?: string
 * }} opcoes
 *
 * @returns {HTMLElement}
 */
function criarCampoTexto(
    {
        nome,
        rotulo,
        valor,
        obrigatorio = false,
        desabilitado = false,
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
        `adminAluno_${nome}`;

    label.textContent =
        rotulo;

    const input =
        document.createElement("input");

    input.id =
        `adminAluno_${nome}`;

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

    input.disabled =
        desabilitado;

    input.autocomplete =
        autocomplete;

    campo.append(
        label,
        input
    );

    return campo;
}

/**
 * Cria controle local do status operacional.
 *
 * @param {boolean} ativo
 * @returns {HTMLElement}
 */
function criarCampoAtivo(ativo) {
    const grupo =
        document.createElement("fieldset");

    grupo.className =
        "admin-user-editor__group";

    const legenda =
        document.createElement("legend");

    legenda.className =
        "admin-user-editor__legend";

    legenda.textContent =
        "Estado operacional";

    const label =
        document.createElement("label");

    label.className =
        "admin-user-editor__option";

    const input =
        document.createElement("input");

    input.type =
        "checkbox";

    input.name =
        "ativo";

    input.checked =
        ativo;

    const texto =
        document.createElement("span");

    texto.textContent =
        input.checked
            ? "Aluno ativo"
            : "Aluno inativo";

    input.addEventListener(
        "change",
        () => {
            texto.textContent =
                input.checked
                    ? "Aluno ativo"
                    : "Aluno inativo";
        }
    );

    label.append(
        input,
        texto
    );

    grupo.append(
        legenda,
        label
    );

    return grupo;
}

/**
 * Cria botões do formulário local.
 *
 * @param {string} textoPrincipal
 * @returns {HTMLElement}
 */
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
 * Cria item clicável da listagem.
 *
 * @param {Object} aluno
 * @returns {HTMLButtonElement}
 */
function criarItemAluno(aluno) {
    const botao =
        document.createElement("button");

    botao.type =
        "button";

    botao.className =
        "admin-students-list__item";

    const nome =
        document.createElement("strong");

    nome.textContent =
        aluno.nome || "Aluno sem nome";

    const detalhes =
        document.createElement("span");

    detalhes.textContent = [
        aluno.matricula || "Sem matrícula",
        aluno.faixa || "Faixa não informada",
        aluno.ativo === true
            ? "Ativo"
            : "Inativo"
    ].join(" • ");

    botao.append(
        nome,
        detalhes
    );

    botao.addEventListener(
        "click",
        () => {
            if (callbackSelecionarAluno) {
                callbackSelecionarAluno(
                    aluno.id
                );
            }
        }
    );

    return botao;
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
 * Processa submit dos formulários locais.
 *
 * @param {SubmitEvent} evento
 */
function tratarSubmitEditor(evento) {
    const formulario =
        evento.target;

    if (
        !(formulario instanceof HTMLFormElement)
    ) {
        return;
    }

    const tipo =
        formulario.dataset.alunoEditor;

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

    const faixa =
        formulario.querySelector(
            'input[name="faixa"]'
        );

    if (
        !(nome instanceof HTMLInputElement) ||
        !(faixa instanceof HTMLInputElement)
    ) {
        return;
    }

    if (
        tipo === "novo" &&
        callbackPrepararNovoAluno
    ) {
        callbackPrepararNovoAluno({
            nome:
                nome.value,

            faixa:
                faixa.value
        });

        return;
    }

    if (
        tipo === "edicao" &&
        callbackPrepararEdicaoAluno
    ) {
        const ativo =
            formulario.querySelector(
                'input[name="ativo"]'
            );

        callbackPrepararEdicaoAluno({
            nome:
                nome.value,

            faixa:
                faixa.value,

            ativo:
                ativo instanceof HTMLInputElement
                    ? ativo.checked
                    : false
        });
    }
}

/**
 * Processa ações auxiliares do editor.
 *
 * @param {MouseEvent} evento
 */
function tratarCliqueEditor(evento) {
    const alvo =
        evento.target instanceof Element
            ? evento.target.closest(
                "[data-acao-editor]"
            )
            : null;

    if (
        !(alvo instanceof HTMLButtonElement)
    ) {
        return;
    }

    const acao =
        alvo.dataset.acaoEditor;

    if (
        acao === "editar" &&
        callbackEditarAluno
    ) {
        callbackEditarAluno();
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
 * Oculta o carregamento.
 *
 * @param {ReturnType<typeof obterElementos>} elementos
 */
function ocultarLoading(elementos) {
    elementos.loading.hidden = true;
}

/**
 * Oculta a listagem.
 *
 * @param {ReturnType<typeof obterElementos>} elementos
 */
function ocultarLista(elementos) {
    elementos.lista.hidden = true;
}

/**
 * Oculta o editor.
 *
 * @param {ReturnType<typeof obterElementos>} elementos
 */
function ocultarEditor(elementos) {
    elementos.editor.replaceChildren();
    elementos.editor.hidden = true;
}

/**
 * Oculta o estado geral.
 *
 * @param {ReturnType<typeof obterElementos>} elementos
 */
function ocultarEstado(elementos) {
    elementos.estado.textContent = "";
    elementos.estado.className =
        "feedback";

    elementos.estado.hidden = true;
}

/**
 * Obtém elementos estruturais do módulo.
 *
 * @returns {{
 *     painel: HTMLElement,
 *     estado: HTMLElement,
 *     loading: HTMLElement,
 *     lista: HTMLElement,
 *     editor: HTMLElement
 * }}
 */
function obterElementos() {
    const painel =
        document.getElementById(
            "painelAdminAlunos"
        );

    const estado =
        document.getElementById(
            "estadoAdminAlunos"
        );

    const loading =
        document.getElementById(
            "loadingAdminAlunos"
        );

    const lista =
        document.getElementById(
            "listaAdminAlunos"
        );

    const editor =
        document.getElementById(
            "editorAdminAlunos"
        );

    if (!painel) {
        throw new Error(
            'O painel "#painelAdminAlunos" não foi encontrado.'
        );
    }

    if (!estado) {
        throw new Error(
            'O estado "#estadoAdminAlunos" não foi encontrado.'
        );
    }

    if (!loading) {
        throw new Error(
            'O loading "#loadingAdminAlunos" não foi encontrado.'
        );
    }

    if (!lista) {
        throw new Error(
            'A lista "#listaAdminAlunos" não foi encontrada.'
        );
    }

    if (!editor) {
        throw new Error(
            'O editor "#editorAdminAlunos" não foi encontrado.'
        );
    }

    return {
        painel,
        estado,
        loading,
        lista,
        editor
    };
}
