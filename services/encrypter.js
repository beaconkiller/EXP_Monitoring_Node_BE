const crypto = require('crypto')
const JSEncrypt = require('node-jsencrypt');


class NE2EE {
    constructor({ selfPrivateKey, otherPublicKey, aesKey }) {
        this.privateKey = selfPrivateKey;
        this.publicKey = otherPublicKey;
        this.aesKey = aesKey
    }

    decrypt(encrypted) {
        try {
            //#region Get RSA and AES key
            const privateKey = Buffer.from(this.privateKey, 'base64').toString('utf8');
            const key = Buffer.from(this.aesKey, 'base64');
            //#endregion

            //#region Separate encrypted IV and Data
            var encryptedBuffer = Buffer.from(encrypted, 'base64')
            var encryptedIv = encryptedBuffer.subarray(0, 344)
            var encryptedData = encryptedBuffer.subarray(344, encryptedBuffer.length)
            //#endregion

            //#region Decrypt IV
            const crypt = new JSEncrypt();
            crypt.setPrivateKey(privateKey);
            var decryptedRsa = crypt.decrypt(encryptedIv.toString('utf8'));
            var iv = Buffer.from(decryptedRsa, 'base64')
            //#endregion

            //#region Decrypt data
            let decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
            let decrypted = decipher.update(encryptedData);
            decrypted = Buffer.concat([decrypted, decipher.final()]);
            //#endregion

            //#region Split data string and image
            // String
            var finalDecrypted = decrypted.toString();
            return finalDecrypted;
            //#endregion
        }
        catch (e) {
            console.error(e);
            throw new Error(e)
        }
    }

    decryptV2(encrypted) {
        try {
            console.log(`Ini ecnrypted nya ${encrypted}`);
            //#region Get RSA and AES key
            console.log('debug 1');
            console.log(this.privateKey);
            const privateKey = Buffer.from(this.privateKey, 'base64').toString('utf8');
            // const key = Buffer.from(this.aesKey, 'base64');
            //#endregion
            console.log('debug 2');

            //#region Separate encrypted IV and Data
            var encryptedBuffer = Buffer.from(encrypted, 'base64')
            console.log('debug 3');

            var encryptedAes = encryptedBuffer.subarray(0, 344)
            console.log('debug 4');

            var encryptedIv = encryptedBuffer.subarray(344, 688)
            console.log('debug 5');

            var publicKey = encryptedBuffer.subarray(688, 1280)
            console.log('debug 6');

            var encryptedData = encryptedBuffer.subarray(1280, encryptedBuffer.length)
            //#endregion
            console.log('debug 7');



            //#region Decrypt IV
            const crypt = new JSEncrypt();
            console.log('debug 8');

            crypt.setPrivateKey(privateKey);
            console.log('debug 9');

            var decryptedIV = crypt.decrypt(encryptedIv.toString('utf8'));
            console.log('debug 10');

            var decryptedAES = crypt.decrypt(encryptedAes.toString('utf8'));
            console.log('debug 11');


            if (!decryptedIV || !decryptedAES) {
                console.log('debug 12');

                throw new Error("RSA decryption failed. Ensure valid keys.");
            }
            
            var iv = Buffer.from(decryptedIV, 'base64')
            var key = Buffer.from(decryptedAES, 'base64')
            //#endregion

            //#region Decrypt data
            let decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
            let decrypted = decipher.update(encryptedData);
            decrypted = Buffer.concat([decrypted, decipher.final()]);
            //#endregion

            //#region Split data string and image
            // String
            var finalDecrypted = decrypted.toString();
            return {
                aes: key.toString('base64'),
                publicKey: publicKey.toString('utf8'),
                data: finalDecrypted,
            };
            //#endregion
        }
        catch (e) {
            console.error(e);
            throw new Error(e)
        }
    }

    encrypt(data, aesAlgorithm = { algorithm: 'aes-256-cbc' }) {
        const publicKey = Buffer.from(this.publicKey, 'base64').toString('utf8');
        const aesKey = Buffer.from(this.aesKey, 'base64');
        const iv = crypto.randomBytes(16);

        let cipher = crypto.createCipheriv(aesAlgorithm.algorithm, aesKey, iv);
        let encryptedData = cipher.update(data);
        encryptedData = Buffer.concat([encryptedData, cipher.final()]);

        const crypt = new JSEncrypt();
        crypt.setPublicKey(publicKey)
        var encryptedIv = crypt.encrypt(iv.toString('base64'));

        var finalEncrypted = Buffer.concat([Buffer.from(encryptedIv), encryptedData]);

        return finalEncrypted.toString('base64')
    }

    encryptV2(data, { aesKey, publicKey, algorithm = 'aes-128-cbc' }) {
        if (aesKey == undefined) throw new Error('aesKey must definied')
        if (publicKey == undefined) throw new Error('publicKey must definied')
        publicKey = Buffer.from(publicKey, 'base64').toString('utf8');
        aesKey = Buffer.from(aesKey, 'base64');
        const iv = crypto.randomBytes(16);

        let cipher = crypto.createCipheriv(algorithm, aesKey, iv);
        let encryptedData = cipher.update(data);
        encryptedData = Buffer.concat([encryptedData, cipher.final()]);

        const crypt = new JSEncrypt();
        crypt.setPublicKey(publicKey)
        var encryptedIv = crypt.encrypt(iv.toString('base64'));
        var encryptedAes = crypt.encrypt(aesKey.toString('base64'));

        var finalEncrypted = Buffer.concat([Buffer.from(encryptedAes), Buffer.from(encryptedIv), encryptedData]);

        return finalEncrypted.toString('base64')
    }
}

function generateKey(
    aesKeySize = 16,
    rsaKeyLength = 2048,
    publicKeyType = 'spki',
    publicKeyFormat = 'pem',
    privateKeyType = 'pkcs8',
    privateKeyFormat = 'pem'
) {
    const aesKey = crypto.randomBytes(aesKeySize).toString('base64')
    const rsaKeyPair = crypto.generateKeyPairSync('rsa', {
        modulusLength: rsaKeyLength,
        publicKeyEncoding: {
            type: publicKeyType,
            format: publicKeyFormat,
        },
        privateKeyEncoding: {
            type: privateKeyType,
            format: privateKeyFormat
        }
    })

    const keyPair = {
        aesKey,
        privateKey: rsaKeyPair.privateKey.toString('base64'),
        publicKey: rsaKeyPair.publicKey.toString('base64'),
    }

    return keyPair
}

exports.NE2EE = NE2EE
exports.generateKey = generateKey