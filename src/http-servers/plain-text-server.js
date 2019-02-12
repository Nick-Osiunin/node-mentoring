import http from 'http'

http
  .createServer()
  .on('request', (req, res) => {
    res.writeHead(200, {'Content-type': 'text/plain'})
    res.end('Hello World!')
  })
  .listen(3000)