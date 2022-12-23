const express = require('express')
const mysql = require("mysql2");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const {encrypt, decrypt} = require("../modules/crypto");
const router = express.Router()

const {mysqlLogin, mysqlPwd} = require("../modules/authorization");


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
    //console.log(req.body)
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
            res.json({'response': false, 'description':'No user'})
        }
        else{
            // console.log(results[0].pwd)///////////////////////////
            bcrypt.compare(password, results[0].pwd, function(err, result) {
                if(result){
                    createToken(req, res, result, results[0].id)
                }
                else{
                    res.status(401)
                    res.json({response: result})
                    res.end()
                }
            });

        }
    });
    connection.end();

}

const insertDBToken = async (userID, token, userAgent, refreshToken) => {

    let connection = mysql.createConnection({
        host     : 'localhost',
        user     : mysqlLogin,
        password : mysqlPwd,
        database : 'super_data'
    }).promise();
    await connection.connect();

    let insertRow = [userID, token, userAgent, refreshToken]
    let sql = "INSERT INTO tokens(user_id, token, user_agent, refresh_token, expires) VALUES(?, ?, ?, ?, DATE_ADD(UTC_TIMESTAMP(), INTERVAL 60 DAY))";

    return connection.query(sql, insertRow)
        .then((result) =>{
            return result
        })
        .then(
            function(res){
                //console.log(res[0].insertId)
                return res[0].insertId
            }
        )
        .catch(err =>{
            console.log(err);
        });
    //console.log(idDevice)
}

const createToken = (req, res, result, userID) => {

    let date = new Date()
    let expires = date.setMonth(date.getMonth()+2);

    let parts = {
        id: userID,
        "userAgent": req.headers['user-agent'],
        "ip": req.headers['x-forwarded-for'],
        "expires": expires,
    }
    let tmp_tkn = encrypt(JSON.stringify(parts))
    // console.log(tmp_tkn)

    let token = tmp_tkn.content + tmp_tkn.iv
    insertDBToken(userID, token, req.headers['user-agent'], tmp_tkn.iv)
        .then((device)=>{
            let response = {response: result, token: token, device: device}
            res.json(response)
        })
}

const getHash = (req, res) => {
    let password = req.body.pwd;
    bcrypt.hash(password, saltRounds, function(err, hash) {
        res.json({'pwd_hash': hash})
    });
}


const deleteToken = (req, res, next) => {
    let hash = {}
    let token = req.headers['authorization-token']
    let deviceId = req.headers['device-id']
    hash.iv = token.substring(token.length - 32)
    hash.content = token.substring(0, token.length - 32)
    const text = decrypt(hash)
    //console.log(text)

    const connection = mysql.createConnection({
        host     : 'localhost',
        user     : mysqlLogin,
        password : mysqlPwd,
        database : 'super_data'
    });

    connection.connect();

    connection.query('SELECT * FROM `tokens` WHERE `id` = ?',[deviceId], function (error, results, fields) {
        if (error) throw error;
        console.log(results.length)
        if(results.length == 0 || results[0].token != token){
            res.status(403)
            res.json({Error: 403})
            return false
        }
        else{
            res.status(200)
            return next();
        }
    });

    connection.end();

}

const logOut = (req, res) => {
    let token = req.headers['authorization-token'];
    let deviceId = req.headers['device-id']
    const connection = mysql.createConnection({
        host     : 'localhost',
        user     : mysqlLogin,
        password : mysqlPwd,
        database : 'super_data'
    });

    connection.connect();

    connection.query('DELETE FROM `tokens` WHERE `id` = ? AND `token` = ?',[deviceId, token], function (error, results, fields) {
        if (error) throw error;
        console.log(results.length)
        if(results.length == 0){
            res.status(403)
            res.json({Error: 403})
            return false
        }
        else{
            res.status(200)
            res.json({response: true})
        }
    });

    connection.end();

}


router.get('/get_token', getToken)
router.get('/refresh_token', refreshToken)
router.post('/get_hash', getHash)
router.post('/login', loginUser)
router.get('/logout', deleteToken, (req, res, next)=> {next()}, logOut)

module.exports = router