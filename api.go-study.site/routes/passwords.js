const express = require('express')
const mysql = require("mysql2");
const router = express.Router()

const mysqlLogin = 'golang'
const mysqlPwd = 'GOlang2022RULEs+'


const listPwdController = (req, res) => {

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
        console.log(results[0]);
        res.json(results)
    });

    connection.end();
}


const insertPwdConstroller = (req, res) => {

    console.log(req.body.system, req.body.pwd)

    let system = req.body.system
    let pwd = req.body.pwd
    let date = new Date()

    //Pwd needs to be Encrypted
    let insertRow = [system, pwd]
    let sql = "INSERT INTO passwords(system_name, pwd, expires) VALUES(?, ?, DATE_ADD(UTC_TIMESTAMP(), INTERVAL 180 DAY))";

    let connection = mysql.createConnection({
        host     : 'localhost',
        user     : mysqlLogin,
        password : mysqlPwd,
        database : 'super_data'
    });

    connection.query(sql, insertRow, function (error, results, fields) {
        if (error) throw error;
        console.log(results.insertId);
        res.json(results.insertId)
    });
}


const connectController = (req, res) => {

    let connection = mysql.createConnection({
        host     : 'localhost',
        user     : mysqlLogin,
        password : mysqlPwd,
        database : 'super_data'
    });
    connection.connect(function(err) {
        if (err) {
            console.error('error connecting: ' + err.stack);
            return;
        }

        console.log('connected as id ' + connection.threadId);
        res.json({'connection': true})
    });

    connection.end();
}


const decryptMysqlController = (req, res) => {

    let hash= {iv: '620a658ae9fd09231317031181175dfb', content: '022122e37a5f11ca1767ca2006bfc7'}
    let string = JSON.stringify(hash)
    res.set({
        'Content-Type': 'text/plain',
        'charset': 'UTF-8'
    })

    res.send(string)
    res.status(200).end()
}

router.get('/list', listPwdController)
router.post('/add_pwd', insertPwdConstroller)
router.post('/check_connection', connectController)

module.exports = router