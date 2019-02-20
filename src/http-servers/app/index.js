import express from 'express'
import md5 from 'md5'
import config from '../../../config/json.json'
import bodyParser from 'body-parser'
import jwt from 'jsonwebtoken'

const app = express()
const port = process.env.PORT || config.expressPort

app.listen(port, () => console.log(`App listening on port ${port}!`))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function (req, res) {
  res.send('Hello world')
})

// Test with body {"login": "admin", "password": "admin"}
app.post('/auth', function (req, res) {
  const {login, password} = config.credentials
  const credentialsMatch =
    req.body &&
    req.body.login &&
    req.body.password &&
    (login === req.body.login) &&
    (password === md5(req.body.password).toUpperCase())

  if (credentialsMatch) {
    const payload = {login, password}
    const token = jwt.sign(payload, config.credentials.secret, {expiresIn: 10})
    res
      .status(200)
      .send(token)
  } else {
    res
      .status(403)
      .send({success: false, message: 'login and password needed'})
  }
})
