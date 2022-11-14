const express = require('express')
const app = express()
const port = 6000

const indexController = (req, res) => {
  let IPaddr = req.headers['x-forwarded-for']

  let response = {
    'API version' : '0.1',
    'Your IP-address': IPaddr
  }
  res.json(response)
}

app.get('/', indexController)

app.listen(port, () => {
  console.log(`Api server listening on port ${port}`)
})
