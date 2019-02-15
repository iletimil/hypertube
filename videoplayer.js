var fs = require('fs');
var express = require('express');
var path = require('path');
var app = express();
var Webtorrent = require('webtorrent');
var http = require('http');
var router = express.Router();

var client = new Webtorrent();

var error_message = "";

//listen for errors to display in the browser
client.on('error', function(err){

    error_message = err.message;
});

// API call that adds a new Magnet Hash to the client so it starts downloading

router.get('/add/:magnet', function(req, res){

    // get the hash and save it

    let magnet = req.params.magnet;

    // add the magnet hash to the client

    client.add(magnet, function(torrent)
    {
        // array that will hold the content of the magnet

        var files = [];

        //loop all the files inside the magnet and add them

        torrent.files.forEach(function(data) {
            files.push({
                name: data.name,
                length: data.length
            });
        });

        res.status(200)
        res.json(files);
    });
});

router.get('/stream/:magnet/:file_name', function(req, res, next){

    let magnet = req.params.magnet;

    var tor = client.get(magnet);
    var file = {};

    for(i = 0; i <tor5.files.lenght; i++)
    {
        if(tor.files[i].name == req.params.file_name)
        {
            file = tor.file[i];
        }
    }

    var range = req.headers.range;
    console.log(range);
})

http.createServer(function(req, res){

    if(req.url != "movie.mp4"){
        res.writeHead(200, {"Content-Type" : "text/html"});
        res.end('<video src ="http://localhost"2020/movie.mp4" controls></video>');
    }
    else
    {
        var file = path.resolve(__dirname, "movie.mp4");
        fs.stat(file, function(err, stats){
            if (err)
            {
                if (err.code === 'ENOENT'){
                    // 404 Error if file isn't found
                    return res.sendStatus(404);
                }
                res.end(err);
            }
            var range = req.headers.range;
            if(!range)
            {
                // 416 wrong range
                return res.sendStatus(416)
            }
            var positions = range.replace(/bytes=/, "").split("-");
            var start = parseInt(positions[0], 10);
            var total = stats.size;
            var end = positions[1] ? parseInt(positions[0], 10) : total - 1;
            var chunksize = (end - start) + 1;

            res.writeHead(206, {
                "Content-Range" : "bytes " + start + "-" + end + "/" + total,
                "Accept-Ranges" : "bytes",
                "Content-Lenght": chunksize,
                "Content-Type"  : "video/mp4"
            });


            var stream = fs.createReadStream(file, {start : start, end : end}).on("open", function(){
                stream.pipe(res);
            }).on("error", function(err){
                res.end(err);
            });
        });
    }
}).listen(2020);