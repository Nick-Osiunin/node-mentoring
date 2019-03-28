import jwt from "jsonwebtoken"
import config from "../config/config"

const {
  authErrorResponse,
  credentials,
  JWT_TOKEN
} = config

export default (req, res, next) => {
  try {
    req.activeUserInfo = jwt.verify(JWT_TOKEN, credentials.secret)
    next()
  } catch (err) {
    res
      .status(200)
      .json({...authErrorResponse, err})
  }
}