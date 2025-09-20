const { NE2EE, generateKeyPair } = require('../services/encrypter');
const JSEncrypt = require('node-jsencrypt');

// Generate a new RSA key pair once when the application starts
const keyPair = generateKeyPair();
const ne2eeInstance = new NE2EE({ selfPrivateKey: keyPair.privateKey });

/**
 * Middleware function to decrypt incoming requests.
 * It expects the encrypted data in req.body.data.
 */
function decryptV2(req, res, next) {
    try {
        console.log("Request body:", req.body);

        if (!req.body || !req.body.data) {
            throw new Error("Missing encrypted data in request body.");
        }

        const parts = req.body.data.split('::');
        if (parts.length === 1) {
            // kalau hanya AES payload (bukan RSA), langsung decrypt pakai AES session
            const { data } = req.body;
            const decrypted = ne2eeInstance.decryptWithSession(data, req.session.aesKey, req.session.iv);
            req.body = JSON.parse(decrypted);
            return next();
        }
      
        // kalau ada 3 part (RSA + AES payload) → berarti request pertama (login)
        const [encryptedAesStr, encryptedIvStr, encryptedDataBase64] = parts;
        const decrypted = ne2eeInstance.decrypt(encryptedAesStr, encryptedIvStr, encryptedDataBase64);

        if (!decrypted || !decrypted.data) {
            throw new Error("Decryption failed, received empty data.");
        }

        console.log("Decrypted Data:", decrypted.data);
        // Pasang data yang sudah didekripsi ke req.body
        req.body = JSON.parse(decrypted.data);
        req.body.aesKey = decrypted.aes; // Opsional, untuk logging/debugging
        req.body.iv = decrypted.iv;
        console.log(`ini dia ${req.body.iv}`);

        next();
    } catch (e) {
        console.error("Decryption Error:", e);
        return res.status(400).json({ message: "Bad Request" });
    }
}

/**
 * Helper function to encrypt a response before sending.
 */
function encryptV2(data, aesKey, iv) {
    // jangan bikin instance baru tanpa privateKey!
    return ne2eeInstance.encryptV2(data, { aesKey, iv, publicKey: keyPair.publicKey });
}

// Export the middleware and the public key for the frontend
module.exports = {
    decryptV2,
    encryptV2,
    publicKey: keyPair.publicKey // Export the public key for the frontend to use
};