var fs = require('fs');
var express = require('express');
var path = require('path');
var app = express();


app.get('/video', function(req, res){
    const path = 'assets/sample.mp4'
    const stat = fs.statSync(path);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range){
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1]
            ? parseInt(parts[1], 10)
            : fileSize -1
        var chunksize = (end - start)+1
        var file = fs.createReadStream(path, {start, end})
        const head = {
            'Content-Range' : `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges' : 'bytes',
            'Content-Lenght': chunksize,
            'Content-Type'  : 'video/mp4',
        }

        res.writeHead(206, head);
        file.pipe(res);
    }else
    {
        const head = {
            'Content-Length' : fileSize,
            'Content-Type'   : 'video/mp4'
        }
        res.writeHead(200, head)
        fs.createReadStream(path).pipe(res)
    }
}).listen('2020');