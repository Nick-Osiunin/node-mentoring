import express from 'express'
import authorize from "../middlewares/authorize"

const router = express.Router()

router.get('/users', authorize, (req, res) => {
  User.find({}, function (err, docs) {
    if (err) {
      res.status(500).send(err.message)
    }
    res
      .status(200)
      .send(docs.map(({name, login, email, pass}) => {
        return {login, pass, name, email}
      }))
  })
})

export default router