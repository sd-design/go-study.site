const express = require('express')
const mysql = require("mysql2");
const {mysqlLogin, mysqlPwd, checkToken} = require("../modules/authorization");
const router = express.Router()


router.use(function (req, res, next) {

let check = checkUser(req, res).then((result)=>{
    console.log(result)
    if(result ==  false){
        console.log('Error 403')
        res.json({Error: 403})
    }

})
    //console.log(check)
next();
});

const checkUser = async(req, res)=> {
    let check = await checkToken(req.headers['device-id'], req.headers['authorization-token'])
    // console.log(check)
   return check
}

const listPwdController = (req, res) => {
    //console.log(req.headers)

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


const insertPwdConstroller = (req, res) => {

    console.log(req.body.system, req.body.pwd)

    let system = req.body.system
    let pwd = req.body.pwd

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

router.get('/list', listPwdController)
router.post('/add_pwd', insertPwdConstroller)
router.post('/check_connection', connectController)

module.exports = router