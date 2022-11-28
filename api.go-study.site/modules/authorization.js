const mysql = require("mysql2");
const {encrypt, decrypt} = require("./crypto");

const fs = require('fs');

const json = fs.readFileSync("../db.json", "utf8");
const db = JSON.parse(json);
const mysqlLogin = db.login
const mysqlPwd = db.pwd

const generateToken = () => {

    let connection = mysql.createConnection({
        host     : 'localhost',
        user     : mysqlLogin,
        password : mysqlPwd,
        database : 'super_data'
    });

    connection.connect();
    let result = {}

    connection.query('SELECT * FROM passwords', function (error, results, fields) {
        if (error) throw error;
        // console.log(results[0]);
        res.json(results)
    });

    connection.end();
}

const checkToken = (deviceId, token, res, next)=>{
    let hash = {}
    hash.iv = token.substring(token.length - 32)
    hash.content = token.substring(0, token.length - 32)
    const text = decrypt(hash)
    //console.log(text)

const connection = mysql.createConnection({
        host     : 'localhost',
        user     : db.login,
        password : db.pwd,
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

module.exports = {
    checkToken,
    generateToken,
    mysqlLogin,
    mysqlPwd
}