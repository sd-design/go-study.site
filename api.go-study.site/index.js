const express = require('express')
const mysql = require('mysql')
const app = express()

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

const port = 6000
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
   
  connection.query('SELECT * FROM users', function (error, results, fields) {
    if (error) throw error;
    console.log('The solution is: ', results[0]);
    result = results[0]; 
    res.json(result)   
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
  
  if(connection.connect()){
    console.log('connect is true');
  } 
   
  connection.end();

  res.json({'connection':true})

}

const insertPwdConstroller = (req, res) => {

  //console.log(req.body.system, req.body.pwd)

  let system = req.body.system
  let pwd = req.body.pwd

  //Pwd needs to be Encrypted
 
  // let response = {
  //   'system':system, 
  //   'password':pwd
  // }
  //console.log(response)
  

  let connection = mysql.createConnection({
    host     : 'localhost',
    user     : mysqlLogin,
    password : mysqlPwd,
    database : 'super_data'
  });

  connection.query('INSERT INTO passwords SET ?', {system: system, pwd: pwd, expires: '2023-09-14 11:46:11'}, function (error, results, fields) {
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
