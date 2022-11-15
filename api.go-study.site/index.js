const express = require('express')
const mysql = require('mysql2')
const app = express()

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

const port = 4200
const mysqlLogin = 'golang'
const mysqlPwd = 'GOlang2022RULEs+'

const indexController = (req, res) => {
  let IPaddr = req.headers['x-forwarded-for']

  let response = {
    'API version' : '0.1',
    'Your IP-address': IPaddr
  }
  res.json(response)
}


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
    result = results[0]; 
    res.json(results)
  });
   
  connection.end();
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

const insertPwdConstroller = (req, res) => {

  console.log(req.body.system, req.body.pwd)

  let system = req.body.system
  let pwd = req.body.pwd

  //Pwd needs to be Encrypted
  let insertRow = [system, pwd, '2023-09-14 11:46:11']
  let sql = "INSERT INTO passwords(system, pwd, expires) VALUES(?, ?, ?)";

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

app.get('/', indexController)
app.get('/connect', connectController)
app.get('/passwords', listPwdController)
app.post('/add_pwd', insertPwdConstroller)


app.listen(port, () => {
  console.log(`Api server listening on port ${port}`)
})
