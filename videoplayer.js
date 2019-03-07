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

        let files = [];

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

    //returns the torrent with the given torrentID
    var tor = client.get(magnet);

    //vaiable that will store the user selected file
    let file = {};

    //loop until it finds the magnet hash the user selected
    for(i = 0; i <tor5.files.lenght; i++)
    {
        if(tor.files[i].name == req.params.file_name)
        {
            file = tor.file[i];
        }
    }

    let range = req.headers.range;
    console.log(range);

    if(!range)
    {
        // 416 wrong range
        return res.sendStatus(416)
    }

    //convert the string in to an array for easy use
    let positions = range.replace(/bytes=/, "").split("-");

    //convert the start value in to an integer
    let start = parseInt(positions[0], 10);

    //save the total file size in to a variable
    let total = file.length;

    //if the end parameter is there convert it to an integer
    //else use the total var as the last the last part to be sent
    let end = positions[1] ? parseInt(positions[0], 10) : total - 1;
    
    //calculate the amount of bytes will be sent back to the browser
    let chunksize = (end - start) + 1;

    //create the header fot the video tag so it knows what is receiving and send the custom head
    res.writeHead(206, {
        "Content-Range" : "bytes " + start + "-" + end + "/" + total,
        "Accept-Ranges" : "bytes",
        "Content-Lenght": chunksize,
        "Content-Type"  : "video/mp4"
    });

    //
    //
    //
    let stream = fs.createReadStream(file, {start : start, end : end}).on("open", function(){
        stream.pipe(res);
    }).on("error", function(err){
        res.end(err);
    });
});

router.get('/list', function(req, res, next){

    let torrent = client.torrents.reduce(function(array, data){
        array.push({
            hash : data.infoHash
        });
        return array;
    }, []);

    //return the magnet hashes
    res.status(200);
	res.json(torrent);
});

//api that sends back stats of the client
router.get('/stats', function(req, res, next){
    res.status(200);
    res.json(stats);
});

//api that deletes magnet from client
router.get('/delete/:magnet', function(req, res, next){

    let magnet = req.params.magnet;

    client.remove(magnet, function(){
        res.status(200);
        res.end();
    });
});

module.exports = router;