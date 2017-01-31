"use strict";

/**
 * server.js
 * This file defines the server for a
 * simple photo gallery web app.
 */

// import the given module (?)
var http = require('http');
var fs = require('fs');

var port = 3000;

// reading the file out of the file system and caching it in this variable
var stylesheet = fs.readFileSync('gallery.css');

var imageNames = ['ace.jpg', 'bubble.jpg', 'chess.jpg', 'fern.jpg', 'mobile.jpg'];

function serveImage(filename, req, res) {
    fs.readFile('images/' + filename, function(err, body) {
        if (err) {
            console.error(err);
            res.statusCode = 500;
            res.statusMessage = "ooooooops"
            res.end("OH NO");
            return;
        }

        res.setHeader("Content-Type", "image/jpeg");
        res.end(body);
    });
}

// create a server
var server = http.createServer(function(req, res) {
    // anon fcn uses createServer's context instead of creating its own scope
    // you can totally mess with the method's code this way using 'this'

    /* serveImage(req.url, req, res);
     * don't do this, it's insecure
     */

    switch(req.url) {
        case "/gallery":
            var gHtml = imageNames.map(function(fileName) {
                return '  <img src="' + fileName + '">';
            }).join();
            var html = '<!doctype html>';
                html += '<head>';
                html += '  <title>Gallery</title>';
                html += '  <link href="gallery.css" rel="stylesheet" type="text/css">';
                html += '</head>';
                html += '<body>';
                html += '  <h1>Gallery</h1>';
                html += gHtml;
                html += '  <h1>Hello.</h1> Time is ' + Date.now();
                html += '</body>';
            res.setHeader('Content-Type', 'text/html');
            res.end(html);
            break;
        case "/gallery.css":
            res.setHeader('Content-Type', 'text/css');
            res.end(stylesheet);
            break;
        case "/chess":
        case "/chess/":
        case "/chess.jpg":
        case "/chess.jpeg":
            serveImage('chess.jpg', req, res);
            break;
        case "/fern":
        case "/fern/":
        case "/fern.jpg":
        case "/fern.jpeg":
            serveImage('fern.jpg', req, res);
            break;
        case "/ace":
        case "/ace/":
        case "/ace.jpg":
        case "/ace.jpeg":
        case "/images/ace.jpg":
            serveImage('ace.jpg', req, res);
            break;
        default:
            res.statusCode = 404;
            res.statusMessage = "Not found";
            res.end();
    }
});

// listen to the given port
server.listen(port, function() {
    console.log("listening on Port " + port);
});

// semicolons AND newline characters delimit lines - don't need both
// you can put multiple lines on one line if you use semicolons, though
