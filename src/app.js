import express from 'express'

require('./models/all-models').toContext(global)
import config from './config/config.json'
import routes from './controllers'

const app = express()

app.use(express.json())
app.use(`/${config.urlPrefix}/`, routes)

export default app