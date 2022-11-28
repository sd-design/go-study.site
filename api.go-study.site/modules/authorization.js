const mysql = require("mysql2/promise");
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

const checkToken = async(deviceId, token)=>{
    let hash = {}
    hash.iv = token.substring(token.length - 32)
    hash.content = token.substring(0, token.length - 32)
    const text = decrypt(hash)
    //console.log(text)

const connection = await mysql.createConnection({
        host     : 'localhost',
        user     : db.login,
        password : db.pwd,
        database : 'super_data'
    });

    await connection.connect();
    let result = false

    const [row, fields] = await connection.execute('SELECT * FROM `tokens` WHERE `id` = ?',[deviceId]);
    if(row.length == 0){
        return false
    }
    else{
        if(row[0].token == token){
            return true
        }
        else{
            return false
        }
    }


}

module.exports = {
    checkToken,
    generateToken,
    mysqlLogin,
    mysqlPwd
}