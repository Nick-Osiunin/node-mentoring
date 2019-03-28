import express from 'express'

const router = express.Router()

import cities from './cities'
import users from './users'
import products from './products'
import auth from './auth'

router.use(cities)
router.use(users)
router.use(products)
router.use(auth)

export default router