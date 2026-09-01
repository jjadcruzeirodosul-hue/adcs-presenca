/**
 * ============================================================
 * ADCS Presença
 * admin-alunos-ui.js
 * ------------------------------------------------------------
 * Responsável exclusivamente pela interface da Gestão
 * Administrativa de Alunos.
 *
 * Responsabilidades neste incremento:
 * - estado de carregamento;
 * - estado vazio;
 * - listagem de alunos;
 * - seleção de aluno;
 * - apresentação somente leitura;
 * - estado de erro.
 *
 * Não conhece Firebase, Firestore, sessão ou Security Rules.
 *
 * Conforme DEVSTD-001.
 * ============================================================
 */

"use strict";

let moduloInicializado = false;
let callbackSelecionarAluno = null;
let callbackVoltarLista = null;

/**
 * Inicializa a interface administrativa de alunos.
 *
 * @param {{
 *     onSelecionarAluno?: (alunoId: string) => void,
 *     onVoltarLista?: () => void
 * }} opcoes
 */
export function initAdminAlunosUI(
    {
        onSelecionarAluno = null,
        onVoltarLista = null
    } = {}
) {
    if (moduloInicializado) {
        return;
    }

    obterElementos();

    callbackSelecionarAluno =
        typeof onSelecionarAluno === "function"
            ? onSelecionarAluno
            : null;

    callbackVoltarLista =
        typeof onVoltarLista === "function"
            ? onVoltarLista
            : null;

    moduloInicializado = true;
}

/**
 * Apresenta o estado de carregamento da listagem.
 */
export function mostrarCarregamentoAlunos() {
    const elementos = obterElementos();

    limparConteudo(elementos.conteudo);

    elementos.estado.textContent =
        "Carregando alunos...";

    elementos.estado.className =
        "feedback feedback--info";

    elementos.estado.hidden = false;
}

/**
 * Apresenta o estado de listagem vazia.
 */
export function mostrarListaVaziaAlunos() {
    const elementos = obterElementos();

    limparConteudo(elementos.conteudo);

    elementos.estado.textContent =
        "Nenhum aluno cadastrado.";

    elementos.estado.className =
        "feedback feedback--info";

    elementos.estado.hidden = false;
}

/**
 * Apresenta uma mensagem de erro.
 *
 * @param {string} mensagem
 */
export function mostrarErroAlunos(mensagem) {
    const elementos = obterElementos();

    elementos.estado.textContent =
        mensagem;

    elementos.estado.className =
        "feedback feedback--erro";

    elementos.estado.hidden = false;
}

/**
 * Renderiza a listagem administrativa de alunos.
 *
 * @param {Object[]} alunos
 */
export function mostrarListaAlunos(alunos) {
    const elementos = obterElementos();

    limparConteudo(elementos.conteudo);

    elementos.estado.hidden = true;

    const lista =
        document.createElement("div");

    lista.className =
        "admin-students-list";

    const fragmento =
        document.createDocumentFragment();

    alunos.forEach((aluno) => {
        fragmento.appendChild(
            criarItemAluno(aluno)
        );
    });

    lista.appendChild(fragmento);
    elementos.conteudo.appendChild(lista);
}

/**
 * Apresenta os dados do aluno selecionado em modo somente leitura.
 *
 * @param {{
 *     id: string,
 *     nome?: string,
 *     faixa?: string,
 *     matricula?: string,
 *     ativo?: boolean
 * }} aluno
 */
export function mostrarAlunoSelecionado(aluno) {
    const elementos = obterElementos();

    limparConteudo(elementos.conteudo);

    elementos.estado.hidden = true;

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

    detalhe.appendChild(titulo);

    detalhe.appendChild(
        criarCampoDetalhe(
            "Matrícula",
            aluno.matricula || "Não informada"
        )
    );

    detalhe.appendChild(
        criarCampoDetalhe(
            "Faixa",
            aluno.faixa || "Não informada"
        )
    );

    detalhe.appendChild(
        criarCampoDetalhe(
            "Status",
            aluno.ativo === true
                ? "Ativo"
                : "Inativo"
        )
    );

    const botaoVoltar =
        document.createElement("button");

    botaoVoltar.type = "button";

    botaoVoltar.className =
        "secondary-button";

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

    detalhe.appendChild(botaoVoltar);

    elementos.conteudo.appendChild(detalhe);
}

/**
 * Cria um item selecionável da listagem.
 *
 * @param {{
 *     id: string,
 *     nome?: string,
 *     faixa?: string,
 *     matricula?: string,
 *     ativo?: boolean
 * }} aluno
 *
 * @returns {HTMLButtonElement}
 */
function criarItemAluno(aluno) {
    const botao =
        document.createElement("button");

    botao.type = "button";

    botao.className =
        "admin-students-list__item";

    const nome =
        document.createElement("strong");

    nome.textContent =
        aluno.nome || "Aluno sem nome";

    const detalhes =
        document.createElement("span");

    detalhes.textContent =
        [
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
 * Cria um campo visual de detalhe.
 *
 * @param {string} rotulo
 * @param {string} valor
 * @returns {HTMLElement}
 */
function criarCampoDetalhe(
    rotulo,
    valor
) {
    const campo =
        document.createElement("p");

    campo.className =
        "admin-student-detail__field";

    const label =
        document.createElement("strong");

    label.textContent =
        `${rotulo}: `;

    const conteudo =
        document.createElement("span");

    conteudo.textContent =
        valor;

    campo.append(
        label,
        conteudo
    );

    return campo;
}

/**
 * Remove o conteúdo atual de um container.
 *
 * @param {HTMLElement} elemento
 */
function limparConteudo(elemento) {
    elemento.replaceChildren();
}

/**
 * Obtém e valida os elementos estruturais do módulo.
 *
 * @returns {{
 *     painel: HTMLElement,
 *     estado: HTMLElement,
 *     conteudo: HTMLElement
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

    const conteudo =
        document.getElementById(
            "conteudoAdminAlunos"
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

    if (!conteudo) {
        throw new Error(
            'O conteúdo "#conteudoAdminAlunos" não foi encontrado.'
        );
    }

    return {
        painel,
        estado,
        conteudo
    };
}
