"use strict";

/**
 * server.js
 * This file defines the server for a
 * simple photo gallery web app.
 */

// 'require' loads the specified library and binds it to the given variable
var http = require('http');
var fs = require('fs');

var port = 3000;

// reading the file out of the file system and caching it in this variable
// we're in the same directory, so we just use the relative path to it
var stylesheet = fs.readFileSync('gallery.css');

// hard-coded :(
var imageNames = ['ace.jpg', 'bubble.jpg', 'chess.jpg', 'fern.jpg', 'mobile.jpg'];

function getImageNames(callback) {
    fs.readdir('images', function(err, fileNames) {
        if (err) {
            callback(err, undefined); // 'false' or 'null' would also work
        }
        else {
            callback(undefined, fileNames); // again, 'false' or 'null' would work
        }
    });
}

function imageNamesToTags(fileNames) {
    return fileNames.map(function(fileName) {
        return '<img src="' + fileName + '" alt="' + fileName + '">';
    });
}

function serveImage(filename, req, res) {
    fs.readFile('images/' + filename, function(err, body) {
        if (err) {
            console.error(err);
            res.statusCode = 404;
            res.statusMessage = "Resource not found (ooooooops)";
            res.end("OH NO");
            return;
        }

        res.setHeader("Content-Type", "image/jpeg");
        res.end(body);
    });
}

function buildGallery(imageTags) {
    var html = '<!doctype html>';
        html += '<head>';
        html += '  <title>Gallery</title>';
        html += '  <link href="gallery.css" rel="stylesheet" type="text/css">';
        html += '</head>';
        html += '<body>';
        html += '  <h1>Gallery</h1>';
        html += imageNamesToTags(imageTags).join('');
        /* html += '  <h1>Hello.</h1> Time is ' + Date.now(); */
        html += '</body>';

    return html;
}

function serveGallery(req, res) {
    getImageNames(function(err, imageNames) {
        if (err) {
            console.error(err);

            res.statusCode = 500; // general server error
            res.statusMessage = "Server error";
            res.end();
            return; // avoiding lots of potential nesting
        }
        res.setHeader('Content-Type', 'text/html');
        res.end(buildGallery(imageNames));
    });
}

// create a server
var server = http.createServer(function(req, res) {
    // function to handle requests
    // anon fcn uses createServer's context instead of creating its own scope
    // (i.e. it uses the scope of the object it's in)
    // you can totally exploit a library's code this way using 'this'

    /* serveImage(req.url, req, res);
     * don't do this, it's insecure
     */

    switch(req.url) {
        case '/':
        case '/gallery':
            serveGallery(req, res);
            break;
        case '/gallery.css':
            res.setHeader('Content-Type', 'text/css');
            res.end(stylesheet);
            break;
        default:
            serveImage(req.url, req, res);
    }
});

// listen to the given port
server.listen(port, function() {
    console.log("listening on Port " + port);
});

// semicolons AND newline characters delimit lines - don't need both
// you can put multiple lines on one line if you use semicolons, though
