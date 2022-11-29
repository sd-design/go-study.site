const express = require('express')
const mysql = require("mysql2");
const {mysqlLogin, mysqlPwd, checkToken} = require("../modules/authorization");
const {encrypt, decrypt} = require("../modules/crypto");
const router = express.Router()


router.use((req, res, next) =>{

    //console.log(req.headers)
    if ('OPTIONS' == req.method) {
        res.sendStatus(200);
    }else{
        if(req.headers['authorization-token'] == undefined || req.headers['authorization-token'] == undefined){
            res.status(403)
            res.json({Error: 403})
        }
        else{
            return checkToken(req.headers['device-id'], req.headers['authorization-token'], res, next)
        }
    }

});

const listPwdController = (req, res) => {
    //console.log(req.headers)

    let connection = mysql.createConnection({
        host     : 'localhost',
        user     : mysqlLogin,
        password : mysqlPwd,
        database : 'super_data'
    });

    connection.connect();

    connection.query('SELECT id, system_name, expires  FROM passwords', function (error, results, fields) {
        if (error) throw error;
        // console.log(results[0]);
        res.status(200)
        res.json(results)
    });

    connection.end();
}

const getPwdController = (req, res) => {

    let idSystem = req.body.id;
    console.log(idSystem)
    let connection = mysql.createConnection({
        host     : 'localhost',
        user     : mysqlLogin,
        password : mysqlPwd,
        database : 'super_data'
    });

    connection.connect();

    connection.query('SELECT system_name, pwd FROM `passwords` WHERE `id` = ?', [idSystem], function (error, results, fields) {
        if (error) throw error;
        // console.log(results[0]);
        if(results.length != 0){
            let tmpPwd = JSON.parse(results[0].pwd)
            tmpPwd = decrypt(tmpPwd)
            res.status(200)
            res.json({response: true, system: results[0].system_name, password: tmpPwd})
        }
        else{
            res.status(404)
            res.json({result: 'Not found'})
        }

    });

    connection.end();
}


const insertPwdController = (req, res) => {
    //console.log(req.body)
    // console.log(req.body.system, req.body.pwd)

    let system = req.body.system
    let pwd = JSON.stringify(encrypt(req.body.pwd))

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
        res.json({response: true, results})
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

router.get('/list', listPwdController)
router.post('/add_pwd', insertPwdController)
router.post('/get_pwd', getPwdController)
router.post('/check_connection', connectController)

module.exports = router