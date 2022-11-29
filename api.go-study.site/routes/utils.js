const express = require('express')
const {encrypt, decrypt} = require("../modules/crypto");
const router = express.Router()

const cryptoController = (req, res) => {
    console.log(req.body)
    let hash = JSON.stringify(encrypt(req.body.pwd))
    res.json({'hash': hash})
}

const decryptController = (req, res) => {

    let hash= {
        iv: '4fb62ce25d811e5a5823232fc9006547',
        content: '28c4749e72b4721e7663acc3e545ab'
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

router.post('/hash', cryptoController)
router.get('/read_hash', decryptController)
router.get('/get_token', getTokenController)

module.exports = router