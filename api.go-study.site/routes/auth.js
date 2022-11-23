const express = require('express')
const mysql = require("mysql2");
const bcrypt = require('bcrypt');
const saltRounds = 10;
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
    let login = req.body.login;
    let password = req.body.pwd;

    // console.log(login, password)

    let connection = mysql.createConnection({
        host     : 'localhost',
        user     : mysqlLogin,
        password : mysqlPwd,
        database : 'super_data'
    });

    connection.connect();
    connection.query('SELECT * FROM `users` WHERE `login` = ?',
        [login], function (error, results, fields) {
        if (error) throw error;
        // console.log(results)
        if(results.length == 0){
            res.status(400)
            res.json({'response': false, 'desccription':'No user'})
        }
        else{
            // console.log(results[0].pwd)
            bcrypt.compare(password, results[0].pwd, function(err, result) {
                if(result){
                    res.json(result)
                }
                else{
                    res.status(401)
                    res.json(result)
                }
            });
        }
    });

}

const getHash = (req, res) => {
    let password = req.body.pwd;
    bcrypt.hash(password, saltRounds, function(err, hash) {
        res.json({'pwd_hash': hash})
    });
}


router.get('/get_token', getToken)
router.get('/refresh_token', refreshToken)
router.post('/get_hash', getHash)
router.post('/login', loginUser)

module.exports = router