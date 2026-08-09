import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

import { db } from "../firebase.js";

/**
 * Obtém o documento do usuário pelo UID.
 *
 * @param {string} uid
 * @returns {Promise<Object|null>}
 */
async function obterUsuario(uid) {
    const referencia = doc(db, "usuarios", uid);
    const documento = await getDoc(referencia);

    if (!documento.exists()) {
        return null;
    }

    return {
        uid: documento.id,
        ...documento.data()
    };
}

export {
    obterUsuario
};