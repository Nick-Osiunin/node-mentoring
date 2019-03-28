import express from 'express'
import authorize from '../middlewares/authorize'

const router = express.Router()

router.get('/products', authorize, (req, res) => {
  Product.find({}, function (err, docs) {
    if (err) {
      res.status(500).send(err.message)
    }
    res.status(200).send(docs)
  })
})

export default router