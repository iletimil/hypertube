var http = require('http');
var fs = require('fs');
var imdb = require('imdb-api');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var server = http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    var readstream = fs.createReadStream(__dirname + '/index.html', 'utf8');
    readstream.pipe(res);
});

server.listen(3000);
console.log('Listening to port 3000...');