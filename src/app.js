import express from 'express'
import jwt from 'jsonwebtoken'
import md5 from 'md5'
import config from './config/config.json'
require('./models/all-models').toContext(global);

const app = express()

const authErrorResponse = {
  code: '403',
  message: 'Authorization failed',
}
// Keep JWT_TOKEN in actual state
const JWT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwibmFtZSI6IlZhc2lsaXkgUHVwa2luIiwibG9naW4iOiJhZG1pbiIsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwicGFzcyI6IjIxMjMyRjI5N0E1N0E1QTc0Mzg5NEEwRTRBODAxRkMzIiwiaWF0IjoxNTUzMTM1NTE5LCJleHAiOjE1NjMxMzU1MTl9.V8XsprhpM883lhr_VSIVQfr_X1BY-Ify1G0rqaP4L5c'

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

app.get('/', (req, response) => {
  City
    .aggregate([{$sample: {size: 1}}])
    .project('city ll -_id')
    .exec((err, randomCity) => {
      if (err) throw err;
      response
        .status(200)
        .send(randomCity)
    })
})

// Test with body {"login": "admin", "password": "admin"}
app.post('/auth', (req, res) => {
  const resObj = {...authErrorResponse}
  const credentialsProvided =
    req.body &&
    req.body.login &&
    req.body.password &&
    true

  if (!credentialsProvided) {
    res
      .status(resObj.code)
      .send(resObj)
    return null;
  }

  const foundUser = (err, matchingUser) => {
    if (err) {
      res.status(500).send(err.message)
    }
    if (matchingUser.length) {
      const {name, login, email} = matchingUser[0];
      resObj.token = jwt.sign({name, login, email}, config.credentials.secret, {expiresIn: 10000000})
      resObj.message = 'Authorization successful'
      resObj.code = '200'
    }
    res
      .status(resObj.code)
      .send(resObj)
  }

  User.find({
    login: req.body.login,
    pass: md5(req.body.password).toUpperCase()
  }, foundUser)
})

app.get('/products', (req, res) => {
  Product.find({}, function (err, docs) {
    if (err) {
      res.status(500).send(err.message)
    }
    res
      .status(200)
      .send(docs.map(({name, price}) => {
        return {name, price}
      }))
  });
})

app.get('/users', (req, res) => {
  User.find({}, function (err, docs) {
    if (err) {
      res.status(500).send(err.message)
    }
    res
      .status(200)
      .send(docs.map(({name, login, email, pass}) => {
        return {login, pass, name, email}
      }))
  });
})

export default app