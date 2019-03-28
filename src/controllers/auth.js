import express from 'express'
import md5 from 'md5'
import config from "../config/config"
import jwt from 'jsonwebtoken'

const router = express.Router()
const {
  authErrorResponse,
} = config

// Test with body {"login": "admin", "password": "admin"}
router.post('/auth', (req, res) => {
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
    return null
  }

  User.find({
    login: req.body.login,
    pass: md5(req.body.password).toUpperCase()
  }, foundUser)

  function foundUser(err, matchingUser) {
    if (err) {
      res.status(500).send(err.message)
    }
    if (matchingUser.length) {
      const {name, login, email} = matchingUser[0]
      resObj.token = jwt.sign({name, login, email}, config.credentials.secret, {expiresIn: 10000000})
      resObj.message = 'Authorization successful'
      resObj.code = '200'
    }
    res
      .status(resObj.code)
      .send(resObj)
  }

})

export default router