/**
 * ============================================================
 * ADCS Presença
 * admin-usuarios-ui.js
 * ------------------------------------------------------------
 * Responsável exclusivamente pela interface da Gestão
 * Administrativa de Usuários.
 *
 * Não conhece Firebase, Firestore, sessão ou Security Rules.
 *
 * Conforme DEVSTD-001.
 * ============================================================
 */

"use strict";

let moduloInicializado = false;
let onSelecionarUsuario = null;
let onPrepararAlteracao = null;
let onCancelarEdicao = null;

/**
 * Inicializa os elementos estruturais da Gestão de Usuários.
 *
 * @param {{
 *     onSelecionar?: (uid: string) => void,
 *     onPrepararAlteracao?: (
 *         edicao: {
 *             ativo: boolean,
 *             perfis: string[]
 *         }
 *     ) => void,
 *     onCancelarEdicao?: () => void
 * }} opcoes
 */
export function initAdminUsuariosUI(
    {
        onSelecionar = null,
        onPrepararAlteracao: callbackPreparar = null,
        onCancelarEdicao: callbackCancelar = null
    } = {}
) {
    if (moduloInicializado) {
        return;
    }

    onSelecionarUsuario =
        typeof onSelecionar === "function"
            ? onSelecionar
            : null;

    onPrepararAlteracao =
        typeof callbackPreparar === "function"
            ? callbackPreparar
            : null;

    onCancelarEdicao =
        typeof callbackCancelar === "function"
            ? callbackCancelar
            : null;

    const elementos = obterElementos();

    elementos.lista.addEventListener(
        "click",
        tratarCliqueLista
    );

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
 * Apresenta estado de carregamento.
 */
export function mostrarLoadingUsuarios() {
    const elementos = obterElementos();

    ocultarEstado(elementos);
    ocultarLista(elementos);
    ocultarEditor(elementos);

    elementos.loading.hidden = false;
}

/**
 * Renderiza a listagem administrativa.
 *
 * @param {Object[]} usuarios
 */
export function mostrarListaUsuarios(usuarios) {
    const elementos = obterElementos();

    ocultarLoading(elementos);
    ocultarEstado(elementos);
    ocultarEditor(elementos);

    elementos.lista.replaceChildren();

    if (
        !Array.isArray(usuarios) ||
        usuarios.length === 0
    ) {
        mostrarEstadoUsuarios(
            "Nenhum usuário cadastrado foi encontrado.",
            "info"
        );

        return;
    }

    const fragmento =
        document.createDocumentFragment();

    usuarios.forEach((usuario) => {
        fragmento.appendChild(
            criarItemUsuario(usuario)
        );
    });

    elementos.lista.appendChild(fragmento);
    elementos.lista.hidden = false;
}

/**
 * Mostra a consulta e o formulário local de edição.
 *
 * @param {Object} usuario
 * @param {{
 *     ehProprioUsuario?: boolean
 * }} opcoes
 */
export function mostrarUsuarioConsultado(
    usuario,
    {
        ehProprioUsuario = false
    } = {}
) {
    const elementos = obterElementos();

    elementos.editor.replaceChildren(
        criarEditorUsuario(
            usuario,
            {
                ehProprioUsuario
            }
        )
    );

    elementos.editor.hidden = false;
}

/**
 * Apresenta mensagem do módulo.
 *
 * @param {string} texto
 * @param {"info" | "success" | "warning" | "error"} tipo
 */
export function mostrarEstadoUsuarios(
    texto,
    tipo = "info"
) {
    const elementos = obterElementos();

    ocultarLoading(elementos);

    elementos.estado.textContent = texto;
    elementos.estado.className =
        `feedback feedback--${tipo}`;
    elementos.estado.hidden = false;
}

/**
 * Limpa a seleção/consulta atual.
 */
export function limparUsuarioConsultado() {
    const elementos = obterElementos();

    elementos.editor.replaceChildren();
    elementos.editor.hidden = true;
}

/**
 * Cria um item da listagem.
 *
 * @param {Object} usuario
 * @returns {HTMLButtonElement}
 */
function criarItemUsuario(usuario) {
    const botao = document.createElement("button");

    botao.type = "button";
    botao.className = "admin-user-item";
    botao.dataset.usuarioUid = String(
        usuario.uid || ""
    );

    const identidade =
        document.createElement("span");

    identidade.className =
        "admin-user-item__identity";

    const uid = document.createElement("strong");

    uid.className = "admin-user-item__uid";
    uid.textContent = String(
        usuario.uid || "UID não informado"
    );

    const perfis =
        document.createElement("span");

    perfis.className =
        "admin-user-item__profiles";

    perfis.textContent =
        formatarPerfis(usuario.perfis);

    identidade.append(
        uid,
        perfis
    );

    const status =
        document.createElement("span");

    status.className =
        usuario.ativo === true
            ? (
                "admin-user-item__status " +
                "admin-user-item__status--active"
            )
            : (
                "admin-user-item__status " +
                "admin-user-item__status--inactive"
            );

    status.textContent =
        usuario.ativo === true
            ? "Ativo"
            : "Inativo";

    botao.append(
        identidade,
        status
    );

    return botao;
}

/**
 * Cria o editor local do usuário.
 *
 * @param {Object} usuario
 * @param {{
 *     ehProprioUsuario: boolean
 * }} opcoes
 *
 * @returns {HTMLFormElement}
 */
function criarEditorUsuario(
    usuario,
    {
        ehProprioUsuario
    }
) {
    const formulario =
        document.createElement("form");

    formulario.className =
        "admin-user-detail";

    formulario.dataset.usuarioEditor =
        "true";

    const titulo =
        document.createElement("h4");

    titulo.className =
        "admin-user-detail__title";

    titulo.textContent =
        "Configuração do usuário";

    const uid =
        criarLinhaDetalhe(
            "UID",
            String(
                usuario.uid ||
                "Não informado"
            )
        );

    const aviso =
        criarAvisoAutoprotecao(
            ehProprioUsuario
        );

    const campoAtivo =
        criarCampoAtivo(
            usuario,
            {
                ehProprioUsuario
            }
        );

    const campoPerfis =
        criarCampoPerfis(
            usuario,
            {
                ehProprioUsuario
            }
        );

    const ajuda =
        document.createElement("p");

    ajuda.className =
        "admin-user-editor__help";

    ajuda.textContent =
        "As alterações administrativas são registradas " +
        "com auditoria e protegidas pelas regras de segurança.";

    const acoes =
        criarAcoesEditor();

    formulario.append(
        titulo,
        uid
    );

    if (aviso) {
        formulario.appendChild(aviso);
    }

    formulario.append(
        campoAtivo,
        campoPerfis,
        ajuda,
        acoes
    );

    return formulario;
}

/**
 * @param {Object} usuario
 * @param {{ehProprioUsuario: boolean}} opcoes
 * @returns {HTMLElement}
 */
function criarCampoAtivo(
    usuario,
    {
        ehProprioUsuario
    }
) {
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

    input.type = "checkbox";
    input.name = "ativo";
    input.checked =
        usuario.ativo === true;

    if (ehProprioUsuario) {
        input.disabled = true;
    }

    const texto =
        document.createElement("span");

    texto.textContent =
        input.checked
            ? "Usuário ativo"
            : "Usuário inativo";

    input.addEventListener(
        "change",
        () => {
            texto.textContent =
                input.checked
                    ? "Usuário ativo"
                    : "Usuário inativo";
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
 * @param {Object} usuario
 * @param {{ehProprioUsuario: boolean}} opcoes
 * @returns {HTMLElement}
 */
function criarCampoPerfis(
    usuario,
    {
        ehProprioUsuario
    }
) {
    const grupo =
        document.createElement("fieldset");

    grupo.className =
        "admin-user-editor__group";

    const legenda =
        document.createElement("legend");

    legenda.className =
        "admin-user-editor__legend";

    legenda.textContent = "Perfis";

    const admin =
        criarOpcaoPerfil(
            "ADMIN",
            Array.isArray(usuario.perfis) &&
            usuario.perfis.includes("ADMIN"),
            ehProprioUsuario
        );

    const operador =
        criarOpcaoPerfil(
            "OPERADOR",
            Array.isArray(usuario.perfis) &&
            usuario.perfis.includes("OPERADOR"),
            false
        );

    grupo.append(
        legenda,
        admin,
        operador
    );

    return grupo;
}

/**
 * @param {string} perfil
 * @param {boolean} marcado
 * @param {boolean} bloqueado
 * @returns {HTMLLabelElement}
 */
function criarOpcaoPerfil(
    perfil,
    marcado,
    bloqueado
) {
    const label =
        document.createElement("label");

    label.className =
        "admin-user-editor__option";

    const input =
        document.createElement("input");

    input.type = "checkbox";
    input.name = "perfil";
    input.value = perfil;
    input.checked = marcado;
    input.disabled = bloqueado;

    const texto =
        document.createElement("span");

    texto.textContent = perfil;

    label.append(
        input,
        texto
    );

    return label;
}

/**
 * @param {boolean} ehProprioUsuario
 * @returns {HTMLElement|null}
 */
function criarAvisoAutoprotecao(
    ehProprioUsuario
) {
    if (!ehProprioUsuario) {
        return null;
    }

    const aviso =
        document.createElement("div");

    aviso.className =
        "feedback feedback--warning " +
        "admin-user-editor__protection";

    aviso.textContent =
        "S4-DEC-003: você está administrando a própria " +
        "conta. A autodesativação e a remoção do perfil " +
        "ADMIN estão bloqueadas.";

    return aviso;
}

/**
 * @returns {HTMLElement}
 */
function criarAcoesEditor() {
    const acoes =
        document.createElement("div");

    acoes.className =
        "admin-user-editor__actions";

    const preparar =
        document.createElement("button");

    preparar.type = "submit";
    preparar.className =
        "button button--primary";

    preparar.textContent =
        "Salvar alterações";

    const cancelar =
        document.createElement("button");

    cancelar.type = "button";
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
 * @param {string} rotulo
 * @param {string} valor
 * @returns {HTMLElement}
 */
function criarLinhaDetalhe(
    rotulo,
    valor
) {
    const linha =
        document.createElement("p");

    linha.className =
        "admin-user-detail__row";

    const label =
        document.createElement("strong");

    label.textContent =
        `${rotulo}: `;

    const conteudo =
        document.createElement("span");

    conteudo.textContent = valor;

    linha.append(
        label,
        conteudo
    );

    return linha;
}

/**
 * Processa seleção da listagem.
 *
 * @param {MouseEvent} evento
 */
function tratarCliqueLista(evento) {
    const alvo =
        evento.target instanceof Element
            ? evento.target.closest(
                "[data-usuario-uid]"
            )
            : null;

    if (
        !(alvo instanceof HTMLButtonElement)
    ) {
        return;
    }

    const uid =
        alvo.dataset.usuarioUid;

    if (
        !uid ||
        !onSelecionarUsuario
    ) {
        return;
    }

    onSelecionarUsuario(uid);
}

/**
 * Processa a validação local do formulário.
 *
 * @param {SubmitEvent} evento
 */
function tratarSubmitEditor(evento) {
    const formulario =
        evento.target;

    if (
        !(formulario instanceof HTMLFormElement) ||
        formulario.dataset.usuarioEditor !==
            "true"
    ) {
        return;
    }

    evento.preventDefault();

    if (!onPrepararAlteracao) {
        return;
    }

    const ativo =
        formulario.querySelector(
            'input[name="ativo"]'
        );

    const perfis =
        Array.from(
            formulario.querySelectorAll(
                'input[name="perfil"]:checked'
            )
        )
        .filter(
            (elemento) =>
                elemento instanceof
                HTMLInputElement
        )
        .map(
            (elemento) =>
                elemento.value
        );

    onPrepararAlteracao({
        ativo:
            ativo instanceof HTMLInputElement
                ? ativo.checked
                : false,

        perfis
    });
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

    if (
        alvo.dataset.acaoEditor ===
            "cancelar" &&
        onCancelarEdicao
    ) {
        onCancelarEdicao();
    }
}

/**
 * @param {unknown} perfis
 * @returns {string}
 */
function formatarPerfis(perfis) {
    if (
        !Array.isArray(perfis) ||
        perfis.length === 0
    ) {
        return "Sem perfil";
    }

    return perfis.join(", ");
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

function ocultarEstado(elementos) {
    elementos.estado.textContent = "";
    elementos.estado.className = "feedback";
    elementos.estado.hidden = true;
}

/**
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
            "painelAdminUsuarios"
        );

    const estado =
        document.getElementById(
            "estadoAdminUsuarios"
        );

    const loading =
        document.getElementById(
            "loadingAdminUsuarios"
        );

    const lista =
        document.getElementById(
            "listaAdminUsuarios"
        );

    const editor =
        document.getElementById(
            "editorAdminUsuarios"
        );

    if (!painel) {
        throw new Error(
            'O painel "#painelAdminUsuarios" não foi encontrado.'
        );
    }

    if (!estado) {
        throw new Error(
            'O estado "#estadoAdminUsuarios" não foi encontrado.'
        );
    }

    if (!loading) {
        throw new Error(
            'O loading "#loadingAdminUsuarios" não foi encontrado.'
        );
    }

    if (!lista) {
        throw new Error(
            'A lista "#listaAdminUsuarios" não foi encontrada.'
        );
    }

    if (!editor) {
        throw new Error(
            'O editor "#editorAdminUsuarios" não foi encontrado.'
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