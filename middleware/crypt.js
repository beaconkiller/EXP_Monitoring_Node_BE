const { NE2EE, generateKeyPair, generateOrLoadKeyPair } = require('../services/encrypter');
const JSEncrypt = require('node-jsencrypt');

// Generate a new RSA key pair once when the application starts
// const keyPair = generateKeyPair();

const keyPair = generateOrLoadKeyPair();

const ne2eeInstance = new NE2EE({ selfPrivateKey: keyPair.privateKey });


/**
 * Middleware function to decrypt incoming requests.
 * It expects the encrypted data in req.body.data.
 */
function decryptV2(req, res, next) {
    try {
        // console.log("Request body:", req.body);

        if (!req.body || !req.body.data) {
            throw new Error("Missing encrypted data in request body.");
        }

        const parts = req.body.data.split('::');
        if (parts.length === 1) {
            // kalau hanya AES payload (bukan RSA), langsung decrypt pakai AES session
            console.log('Masuk kesini nihh rsa nya ada')
            const { data } = req.body;
            const decrypted = ne2eeInstance.decryptWithSession(data, req.session.aesKey, req.session.iv);
            req.body = JSON.parse(decrypted);
            return next();
        }

        console.log('Masuk kesini gaada rsa nya')

        // kalau ada 3 part (RSA + AES payload) → berarti request pertama (login)
        const [encryptedAesStr, encryptedIvStr, encryptedDataBase64] = parts;

        console.log(`encryptedAesStr ${encryptedAesStr}`)
        console.log(`encryptedIvStr ${encryptedIvStr}`)
        console.log(`encryptedDataBase64 ${encryptedDataBase64}`)

        const decrypted = ne2eeInstance.decrypt(encryptedAesStr, encryptedIvStr, encryptedDataBase64);

        if (!decrypted || !decrypted.data) {
            throw new Error("Decryption failed, received empty data.");
        }

        console.log("Decrypted Data:", decrypted.data);

        let parsed;
        try {
            parsed = JSON.parse(decrypted.data);
        } catch (parseErr) {
            parsed = { payload: decrypted.data };
        }

        // Pastikan parsed adalah object sebelum menambahkan aes/iv
        if (typeof parsed !== 'object' || parsed === null) {
            parsed = { payload: parsed };
        }

        // Pasang data yang sudah didekripsi ke req.body
        // tambahkan aes/iv dari proses dekripsi supaya controller bisa enkripsi balik
        parsed.aesKey = decrypted.aes; 
        parsed.iv = decrypted.iv;
        req.body = parsed;
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