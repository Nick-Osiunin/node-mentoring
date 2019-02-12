import http from 'http'
import fs from 'fs'
import * as path from 'path'
import {Transform} from 'stream'

const indexHtml = './data/index.html'
const replaceMarker = '{message}'
const newPageTitle = 'Hello world!'

const logError = err => console.log(err)
const handleErr = (res, req) => {
  req.on('error', logError)
  res.on('error', logError)
}
const renderText = str => str.replace(replaceMarker, newPageTitle)

class replaceWithText extends Transform {
  constructor() {
    super()
  }

  _transform(chunk, encoding, done) {
    const line = chunk.toString()
    this.push(renderText(line))
    done()
  }
}

http
  .createServer()
  .on('request', (req, res) => {
    handleErr(res, req)
    res.writeHead(200, {'Content-type': 'text/html'})
    try {
      const content = fs.readFileSync(path.resolve(indexHtml)).toString()
      res.end(renderText(content))
    } catch (err) {
      res.end(`<pre>${err.message}</pre>`)
      throw err
    }
  })
  .listen(3000)

http
  .createServer()
  .on('request', (req, res) => {
    handleErr(res, req)
    res.writeHead(200, {'Content-type': 'text/html'})
    try {
      const readStream = fs.createReadStream(path.resolve(indexHtml))
      readStream
        .pipe(new replaceWithText())
        .pipe(res)
    } catch (err) {
      res.end(`<pre>${err.message}</pre>`)
      throw err
    }
  })
  .listen(3001)