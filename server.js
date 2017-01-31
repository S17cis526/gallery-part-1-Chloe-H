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
            var html = '<!doctype html>';
                html += '<head><title>Gallery</title></head>';
                html += '<body>';
                html += '  <h1>Gallery</h1>';
                html += '  <image src="images/ace.jpg" alt="a fishing ace at work">';
                html += '  <h1>Hello.</h1> Time is ' + Date.now();
                html += '</body>'
            res.setHeader('Content-Type', 'text/html');
            res.end(html);
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
