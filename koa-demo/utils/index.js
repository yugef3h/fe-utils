var http = require('http');
var fs = require('fs')

http.createServer(function (request, response) {
  response.writeHead(200, {'Content-Type': 'text/plain; charset=UTF-8'});
  response.end('Hello World');
}).listen(3000);

console.log('Server running at http://127.0.0.1:3000/');