import express from 'express'
import bodyParser from 'body-parser'
import config from './config/config.json'
import models from './models/all-models'
import routes from './controllers'

models.toContext(global)
const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.json())
app.use(`/${config.urlPrefix}/`, routes)

export default app