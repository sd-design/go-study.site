const express = require('express')
const mysql = require('mysql2')
const { encrypt, decrypt } = require('./crypto')
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

const cryptoController = (req, res) => {
  let hash = encrypt('I love cupcakes')
  console.log(hash);
  res.json({'hash': hash})
}

const decryptController = (req, res) => {

  let hash= {
    iv: '620a658ae9fd09231317031181175dfb',
    content: '022122e37a5f11ca1767ca2006bfc7'
  }
  let string = decrypt(hash)
  res.json({'decrypt_string': string})
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

const insertPwdConstroller = (req, res) => {

  console.log(req.body.system, req.body.pwd)

  let system = req.body.system
  let pwd = req.body.pwd
  let date = new Date()
  let expires = date.getFullYear() +"-"+date.getMonth()+"-"+date.getDate()+ " " + date.toLocaleTimeString()

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

const getTokenController = (req, res) => {
  let response = {
    'API version' : '0.1',
    'Your IP-address': 'ya-ay token'
  }
  res.json(response)
}

app.get('/', indexController)
app.get('/connect', connectController)
app.get('/passwords', listPwdController)
app.get('/hash', cryptoController)
app.get('/read_hash', decryptController)
app.get('/mysql_hash', decryptMysqlController)
app.post('/add_pwd', insertPwdConstroller)
app.get('/get_token', getTokenController)



app.listen(port, () => {
  console.log(`Api server listening on port ${port}`)
})
