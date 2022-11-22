const express = require('express')
const {encrypt, decrypt} = require("../crypto");
const router = express.Router()

const cryptoController = (req, res) => {
    let hash = encrypt('I love cupcakes')
    console.log(hash);
    res.json({'hash': hash})
}

const decryptController = (req, res) => {

    let hash= {
        iv: '620a658ae9fd09231317031181175dfb',
        content: '022122e37a5f11ca1767ca2006bfc7'
    }
    let string = decrypt(hash)
    res.json({'decrypt_string': string})
}

const getTokenController = (req, res) => {
    let response = {
        'API version' : '0.1',
        'Your IP-address': 'ya-ay token'
    }
    res.json(response)
}

router.get('/hash', cryptoController)
router.get('/read_hash', decryptController)
router.get('/get_token', getTokenController)

module.exports = router