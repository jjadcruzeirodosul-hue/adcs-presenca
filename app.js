/**
 * ============================================================
 * ADCS Presença
 * app.js
 * ------------------------------------------------------------
 * Bootstrap principal da aplicação.
 * Responsável por inicializar os módulos.
 * Conforme DEVSTD-001.
 * ============================================================
 */

"use strict";

import { initUI, mostrarMensagem } from "./js/ui.js";
import { carregarProfessores } from "./js/professor.js";
import { initRegistroManual } from "./js/manual.js";
import { initScanner } from "./js/scanner.js";

/**
 * Inicializa a aplicação.
 *
 * @returns {Promise<void>}
 */
async function iniciarAplicacao() {
    try {
        initUI();

        await carregarProfessores();

        initRegistroManual();
        initScanner();

        console.info("ADCS Presença inicializado com sucesso.");
    } catch (erro) {
        console.error(
            "Erro ao inicializar o ADCS Presença:",
            erro
        );

        mostrarMensagem(
            "Não foi possível inicializar a aplicação. Atualize a página e tente novamente.",
            "error"
        );
    }
}

/**
 * Inicializa imediatamente quando o DOM já estiver disponível.
 * Caso contrário, aguarda o evento DOMContentLoaded.
 *
 * Essa verificação é necessária porque dependências com importação
 * dinâmica podem concluir o carregamento após o DOMContentLoaded.
 */
if (document.readyState === "loading") {
    document.addEventListener(
        "DOMContentLoaded",
        iniciarAplicacao,
        { once: true }
    );
} else {
    iniciarAplicacao();
}