const { NE2EE } = require('../services/encrypter');

// decode dari Base64 ke string UTF-8
const privateKeyPem = Buffer.from(process.env.PRIVATE_KEY_2048, 'base64').toString('utf8');
const publicKeyPem = Buffer.from(process.env.PUBLIC_KEY_2048, 'base64').toString('utf8');


module.exports.ne2ee_bm = new NE2EE({
    selfPrivateKey: privateKeyPem,
    otherPublicKey: publicKeyPem,
    aesKey: process.env.AES_KEY,
});
