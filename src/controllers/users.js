import express from 'express'
import authorize from "../middlewares/authorize"

const router = express.Router()

router.get('/users', authorize, (req, res) => {
  User.find({}, function (err, docs) {
    if (err) res.status(500).send(err.message)
    res.status(200).send(docs)
  })
})

router
  .route('/users/:id')
  .get(authorize, (req, res) => {
    User.findById(req.params.id, (err, doc) => {
      if (err) res.status(500).send(err.message)
      res.status(200).send(doc)
    });
  })
  .delete((req, res) => {
    User.deleteOne({_id: req.params.id}, (err, city) => {
      if (err) res.status(500).send(err.message)
      res.status(200).send(city)
    });
  })

export default router