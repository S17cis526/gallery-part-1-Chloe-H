"use strict";

/**
 * server.js
 * This file defines the server for a
 * simple photo gallery web app.
 */

var http = require('http');
var fs = require('fs');

var port = 3000;
var title = "Gallery";

var stylesheet = fs.readFileSync('gallery.css');

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
        html += '  <title>' + title + '</title>';
        html += '  <link href="gallery.css" rel="stylesheet" type="text/css">';
        html += '</head>';
        html += '<body>';
        html += '  <h1>' + title + '</h1>';
        html += '  <form action="">';
        html += '    <input type="text" name="title">';
        html += '    <input type="submit" value="Change' + title + 'Title">';
        html += '  </form>';
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
    // we should have at most two parts when splitting the URL like this:
    // a resource and a querystring separated by a '?'
    var url = req.url.split('?');
    var resource = url[0];
    var queryString = url[1];

    switch(resource) {
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

server.listen(port, function() {
    console.log("listening on Port " + port);
});
