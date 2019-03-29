import express from 'express'

const router = express.Router()

router
  .route('/cities')
  .get((req, res) => {
    City.find({}, (err, docs) => {
      if (err) res.status(500).send(err.message)
      res.status(200).send(docs)
    })
  })
  .post((req, res) => {
    City.create(req.body, (err, docs) => {
      if (err) res.status(500).send(err.message)
      res.status(200).send(docs)
    })
  })

router
  .route('/cities/:id')
  .delete((req, res) => {
    City.deleteOne({_id: req.params.id}, (err, city) => {
      if (err) res.status(500).send(err.message)
      res.status(200).send(city)
    });
  })
  .get((req, res) => {
    if (req.params.id === 'random') {
      return City
        .aggregate([{$sample: {size: 1}}])
        .project(' -__v')
        .exec((err, randomCity) => {
          if (err) res.status(500).send(err.message)
          res.status(200).send(randomCity)
        })
    }

    City.findById(req.params.id, (err, city) => {
      if (err) res.status(500).send(err.message)
      res.status(200).send(city)
    });
  })
  .put((req, res) => {
    City.updateOne(
      {_id: req.params.id}, req.body, {upsert: true},
      (err, city) => {
        if (err) res.status(500).send(err.message)
        res
          .status(200)
          .send(city)
      });
  });

export default router