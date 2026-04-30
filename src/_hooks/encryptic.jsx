import CryptoJS from 'crypto-js';

export const auth_enrypt = (data) => {
    try {
        const jsonString = typeof data === 'string' ? data : JSON.stringify(data);
        const ciphertext = CryptoJS.AES.encrypt(jsonString, ENCRYPTION_KEY).toString();
        return ciphertext;
    } catch (error) {
        console.error("Encryption failed:", error);
        return null;
    }
};

export const auth_decrypt = (ciphertext) => {
    if (!ciphertext) return null;

    try {
        const bytes             = CryptoJS.AES.decrypt(ciphertext, ENCRYPTION_KEY);
        const decryptedString   = bytes.toString(CryptoJS.enc.Utf8);

        if (!decryptedString) return null;

        try {
            return JSON.parse(decryptedString);
        } catch {
            return decryptedString;
        }
    } catch (error) {
        console.error("Decryption failed:", error);
        return null;
    }
};

export const generate_jwt_decrypt = () => {

    const iTitled = auth_decrypt('U2FsdGVkX19G0pj09nnNDuCs/naSFhwULM+mQnJanj8=')

    const ciphertext = localStorage.getItem(iTitled);
    
    if (!ciphertext) return null;

    try {
        const bytes = CryptoJS.AES.decrypt(ciphertext, ENCRYPTION_KEY);
        const decryptedString = bytes.toString(CryptoJS.enc.Utf8);

        if (!decryptedString) return null;

        const storageData = JSON.parse(decryptedString);
        
        return {
            userToken:   storageData.state?.userToken   || null,
            userProfile: storageData.state?.userProfile || null,
            version:     storageData.version            || 0
        };
    } catch (error) {
        return null;
    }
};
