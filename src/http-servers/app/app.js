import express from 'express'
import jwt from 'jsonwebtoken'
import md5 from 'md5'
import config from './config/config.json'
import users from './config/users.json'
import db from './db/models'

const app = express()

const authErrorResponse = {
  code: '403',
  message: 'Authorization failed',
}
// Keep JWT_TOKEN in actual state
const JWT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwibmFtZSI6IlZhc2lsaXkgUHVwa2luIiwibG9naW4iOiJhZG1pbiIsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwicGFzcyI6IjIxMjMyRjI5N0E1N0E1QTc0Mzg5NEEwRTRBODAxRkMzIiwiaWF0IjoxNTUyNTIwODU2LCJleHAiOjE1NjI1MjA4NTZ9.1oU34VKjf0M_iisnqgOYPzPhDhluP1CQPtWcIyc8vEo'

app.use(express.json())

app.use(['/products', '/users'], (req, res, next) => {
  try {
    req.activeUserInfo = jwt.verify(JWT_TOKEN, config.credentials.secret)
    next()
  } catch (err) {
    res
      .status(200)
      .json({...authErrorResponse, err})
  }
})

app.get('/', function (req, res) {
  db.sequelize
    .authenticate()
    .then(() => {
      res.send('Sequelize: Connection has been established successfully.')
    })
    .catch(err => {
      console.error('Unable to connect to the database:', err);
      res.send('Sequelize: Unable to connect to the database.')
    });
})

// Test with body {"login": "admin", "password": "admin"}
app.post('/auth', function (req, res) {
  const resObj = authErrorResponse
  const credentialsProvided =
    req.body &&
    req.body.login &&
    req.body.password &&
    true

  const matchingUser =
    credentialsProvided &&
    users.find(usr =>
      usr.login === req.body.login
      && usr.pass === md5(req.body.password).toUpperCase())

  if (matchingUser) {
    resObj.token = jwt.sign(matchingUser, config.credentials.secret, {expiresIn: 10000000})
    resObj.message = 'Authorization successful'
    resObj.code = '200'
  }

  res
    .status(resObj.code)
    .send(resObj)
})

app.get('/products', function (req, res) {
  db.Product
    .findAll({})
    .then(products => {
      res
        .status(200)
        .json(products)
    })
})

app.get('/users', function (req, res) {
  db.User
    .findAll({})
    .then(users => {
      res
        .status(200)
        .json(users)
    })
})

export default app