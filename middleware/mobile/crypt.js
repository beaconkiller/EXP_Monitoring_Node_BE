const JSEncrypt = require('node-jsencrypt');
const fs = require('fs');
const { ne2ee_bm } = require('../../config/ne2ee_bm')

module.exports = {
    encrypt,
    decrypt,
    getKey,
    decryptV2,
    encryptV2
}

function encrypt(req, res, next) {
    var data = req.body.data
    data = JSON.stringify(data)
    var publicKey = fs.readFileSync(__dirname + '../../id_rsa_public.pem', "ascii")
    const crypt = new JSEncrypt();
    crypt.setKey(publicKey);
    req.encrypted = crypt.encrypt(data);
    next()
}

function decrypt(req, res, next) {
    if (typeof req.body.key != 'undefined') {
        if (Buffer.from(req.body.key, 'base64').toString('base64') === req.body.key) {
            var buff = Buffer.from(req.body.key, 'base64')
            var key = buff.toString('ascii')
            req.publicKey = key
        }
        else {
            req.publicKey = req.body.key
        }
    }
    var data = req.body.encrypted

    var privateKey = process.env.PRIVATE_KEY
    const crypt = new JSEncrypt();
    crypt.setPrivateKey(privateKey)
    var decrypted = crypt.decrypt(data)
    try {
        req.decrypted = JSON.parse(decrypted)
    }
    catch {
        req.decrypted = decrypted
    }
    next()
}

function decryptV2(req, res, next) {
    try {
        console.log("Request body:", req.body);

        if (!req.body || !req.body.data) {
            throw new Error("Missing encrypted data");
        }

        var decrypted = ne2ee_bm.decryptV2(req.body.data);

        if (!decrypted || !decrypted.data) {
            throw new Error("Decryption failed, received empty data");
        }

        console.log(decrypted);

        req.body = JSON.parse(decrypted.data);
        req.body.aesKey = decrypted.aes;
        req.body.publicKey = decrypted.publicKey;

        next();
    } catch (e) {
        console.error("Decryption Error:", e);
        return res.status(400).json({ message: "Bad Request" });
    }
}


function encryptV2(data, aesKey, publicKey) {
    var encrypted = ne2ee_bm.encryptV2(JSON.stringify(data), { aesKey: aesKey, publicKey: publicKey })

    return encrypted;
}

function getKey(req, res, next) {
    var publicKey = req.body.key

    if (typeof publicKey != 'undefined') {
        req.publicKey = publicKey
    }

    next()
}