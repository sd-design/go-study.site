const crypto = require('crypto');
const fs = require('fs');
let secretKey = ''

fs.readFile('../key.json', {encoding:'utf-8'},function(error, contents){
    const secret = JSON.parse(contents)
    secretKey = secret.key
});

const algorithm = 'aes-256-ctr'


const encrypt = text => {
    const iv = crypto.randomBytes(16)

    const cipher = crypto.createCipheriv(algorithm, secretKey, iv)

    const encrypted = Buffer.concat([cipher.update(text), cipher.final()])

    return {
        iv: iv.toString('hex'),
        content: encrypted.toString('hex')
    }
}

const decrypt = hash => {
    const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(hash.iv, 'hex'))

    const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()])

    return decrpyted.toString()
}

const hashUserID = text => {
    text = text + Date.now()
    let hash = crypto.createHash('md5').update(text).digest("hex")
    return hash
}

module.exports = {
    encrypt,
    decrypt,
    hashUserID
}