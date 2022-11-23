const express = require('express')
const mysql = require("mysql2");
const {encrypt, decrypt} = require("../crypto");
const router = express.Router()

const mysqlLogin = 'golang'
const mysqlPwd = 'GOlang2022RULEs+'


const getToken = (req, res) => {
    let userAgent = req.headers['user-agent']
    console.log(userAgent)
    let IPaddr = req.headers['x-forwarded-for']
    let token  = encrypt(IPaddr + userAgent )
    res.json({'token': token})
}

const refreshToken = (req, res) => {

    let hash= {
        iv: '620a658ae9fd09231317031181175dfb',
        content: '022122e37a5f11ca1767ca2006bfc7'
    }
    let string = decrypt(hash)
    res.json({'decrypt_string': string})
}

const loginUser = (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    let hash= {
        iv: '620a658ae9fd09231317031181175dfb',
        content: '022122e37a5f11ca1767ca2006bfc7'
    }
    let string = decrypt(hash)
    res.json({'decrypt_string': string})
}


router.get('/get_token', getToken)
router.get('/refresh_token', refreshToken)
router.post('/login', loginUser)

module.exports = router