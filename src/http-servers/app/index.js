import config from './config/config'
import app from './app'

const port = process.env.PORT || config.expressPort
app.listen(port, () => console.log(`App listening on port ${port}!`))