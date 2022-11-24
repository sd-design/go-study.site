const express = require('express')
const app = express()
const port = 4200
const passwords = require('./routes/passwords')
const utils = require('./routes/utils')
const auth = require('./routes/auth')

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.disable('x-powered-by');


const indexController = (req, res) => {
  let IPaddr = req.headers['x-forwarded-for']

  let response = {
    'API version' : '0.1',
    'Your IP-address': IPaddr
  }
  res.json(response)
}

app.use('/passwords', passwords);
app.use('/utils', utils);
app.use('/auth', auth);
app.get('/', indexController)
app.use((req, res, next) => {
  res.status(404)
  res.json({
    'API version' : '0.1',
    'Error': 404
  })
})


app.listen(port, () => {
  console.log(`Api server listening on port ${port}`)
})
