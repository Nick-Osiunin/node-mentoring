import express from 'express'
import authorize from '../middlewares/authorize'

const router = express.Router()

router
  .route('/products')
  .get(authorize, (req, res) => {
    Product.find({}, (err, docs) => {
      if (err) res.status(500).send(err.message)
      res.status(200).send(docs)
    })
  })
  .post(authorize, (req, res) => {
    Product.create(req.body, (err, docs) => {
      if (err) res.status(500).send(err.message)
      res.status(200).send(docs)
    })
  })

router
  .route('/products/:id')
  .get(authorize, (req, res) => {
    Product.findById(req.params.id, (err, doc) => {
      if (err) res.status(500).send(err.message)
      res.status(200).send(doc)
    });
  })
  .delete((req, res) => {
    Product.deleteOne({_id: req.params.id}, (err, city) => {
      if (err) res.status(500).send(err.message)
      res.status(200).send(city)
    });
  })

router
  .get('/products/:id/name', authorize, (req, res) => {
    Product
      .findById(req.params.id)
      .select('name')
      .exec((err, doc) => {
        if (err) res.status(500).send(err.message)
        res.status(200).send(doc)
      });
  })
export default router