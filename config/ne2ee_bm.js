const { NE2EE } = require('../services/encrypter');

module.exports.ne2ee_bm = new NE2EE({
    selfPrivateKey: process.env.PRIVATE_KEY_2048,
    otherPublicKey: process.env.PUBLIC_KEY_2048,
    aesKey: process.env.AES_KEY,
});
