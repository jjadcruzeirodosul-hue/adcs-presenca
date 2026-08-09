import {
    signInWithEmailAndPassword,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

import { auth } from "../firebase.js";

/**
 * Realiza a autenticação do usuário utilizando e-mail e senha.
 *
 * @param {string} email
 * @param {string} senha
 * @returns {Promise<UserCredential>}
 */
async function login(email, senha) {
    return signInWithEmailAndPassword(auth, email, senha);
}

/**
 * Observa as alterações no estado de autenticação.
 *
 * @param {function} callback
 * @returns {function} Função para cancelar a observação.
 */
function observarAutenticacao(callback) {
    return onAuthStateChanged(auth, callback);
}

export {
    login,
    observarAutenticacao
};