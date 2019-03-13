import express from 'express'
import jwt from 'jsonwebtoken'
import md5 from 'md5'
import config from './config/config.json'
import products from './config/products.json'
import users from './config/users.json'
import Sequelize from 'sequelize'

const app = express()

const authErrorResponse = {
  code: '403',
  message: 'Authorization failed',
}
const JWT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwibmFtZSI6IlZhc2lsaXkgUHVwa2luIiwibG9naW4iOiJhZG1pbiIsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwicGFzcyI6IjIxMjMyRjI5N0E1N0E1QTc0Mzg5NEEwRTRBODAxRkMzIiwiaWF0IjoxNTUwNzk3ODkyLCJleHAiOjE1NTA4MDc4OTJ9.Si0hx74ugulr_xHgYTXKN1_qGFXN_zfDGggxL2OQvmc'

const sequelize = new Sequelize('task6', 'admin', 'admin', {
  host: '127.0.0.1',
  dialect: 'postgres',
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
})

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

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
  res.send('Task6: SQL')
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
    resObj.token = jwt.sign(matchingUser, config.credentials.secret, {expiresIn: 10000})
    resObj.message = 'Authorization successful'
    resObj.code = '200'
  }

  res
    .status(resObj.code)
    .send(resObj)
})

app.get('/products', function (req, res) {
  console.log(req.activeUserInfo)
  res
    .status(200)
    .json(products)
})

app.get('/users', function (req, res) {
  console.log(req.activeUserInfo)
  res
    .status(200)
    .json(users)
})

export default app