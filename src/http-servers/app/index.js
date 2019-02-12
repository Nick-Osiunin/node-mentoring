import express from 'express'

const app = express()
const port = process.env.PORT || 8080

app.listen(port, () => console.log(`App listening on port ${port}!`))

app.get('/', function (req, res) {
  res.send('Hello world')
})

