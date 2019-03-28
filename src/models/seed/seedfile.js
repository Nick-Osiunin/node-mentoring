const mongoose = require('mongoose')
const citiesJson = require('../../config/cities')
const usersJson = require('../../config/users')
const productsJson = require('../../config/products')
require('../all-models').toContext(global)

Promise
  .all([
    City.create(citiesJson),
    User.create(usersJson),
    Product.create(productsJson)
  ])
  .then(() => {
    console.log("Seed complete!")
    mongoose.connection.close()
  })
