import {
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
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
 * Encerra a sessão do usuário autenticado.
 *
 * A alteração do estado de autenticação será propagada
 * aos demais módulos por meio de observarAutenticacao().
 *
 * @returns {Promise<void>}
 */
async function logout() {
    return signOut(auth);
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
    logout,
    observarAutenticacao
};
