import express from 'express'
const router = express.Router()

router.get('/cities', (req, response) => {
  City
    .aggregate([{$sample: {size: 1}}])
    .project(' -__v')
    .exec((err, randomCity) => {
      if (err) throw err
      response
        .status(200)
        .send(randomCity)
    })
})

router.get('/cities/random', (req, response) => {
  City
    .aggregate([{$sample: {size: 1}}])
    .project(' -__v')
    .exec((err, randomCity) => {
      if (err) throw err
      response
        .status(200)
        .send(randomCity)
    })
})

export default router