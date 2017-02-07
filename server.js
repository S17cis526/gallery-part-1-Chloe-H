"use strict";

/**
 * server.js
 * This file defines the server for a
 * simple photo gallery web app.
 */

var http = require('http');
var fs = require('fs');
var url = require('url');

var port = 3000;

/* var defaultConfig = {title: "Gallery"}; */

var config = JSON.parse(fs.readFileSync('config.json') /* || defaultConfig */);
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

function uploadImage(req, res) {
    var body = '';
    // req.on('event_name', event_handler)
    req.on('error', function() {
        res.statusCode = 500;
        res.end();
    }); // we're donezo
    req.on('data', function(data) {
        body += data;
    });
    req.on('end', function() {
        fs.writeFile('filename', body, function(err) {
            if (err) {
                console.error(err);
                res.statusCode = 500;
                res.end();
                return;
            }
            serveGallery(req, res);
        });
    });
}

function buildGallery(imageTags) {
    var html = '<!doctype html>';
        html += '<head>';
        html += '  <title>' + config.title + '</title>';
        html += '  <link href="gallery.css" rel="stylesheet" type="text/css">';
        html += '</head>';
        html += '<body>';
        html += '  <h1>' + config.title + '</h1>';
        html += '  <form action="">';
        html += '    <input type="text" name="title">';
        html += '    <input type="submit" value="Change Gallery Title">';
        html += '  </form>';
        html += imageNamesToTags(imageTags).join('');
        html += '<form action="" method="POST">';
        html += '  <input type="file" name="image">';
        html += '  <input type="submit" value="Upload Image">';
        html += '</form>';
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

var server = http.createServer(function(req, res) {
    // we should have at most two parts when splitting the URL like this:
    // a resource and a querystring separated by a '?'
    var urlParts = url.parse(req.url);

    /*
    var url = req.url.split('?');
    var resource = url[0];
    var queryString = url[1];
    */

    if (urlParts.query) {
        var matches = /title=(.+)($|&)/.exec(urlParts.query);

        if (matches && matches[1]) {
            config.title = decodeURIComponent(matches[1]);
            fs.writeFile('config.json', JSON.stringify(config)); // JavaScript Object Serialization Notation
        }
    }

    switch(urlParts.pathname) {
        case '/':
        case '/gallery':
            if (req.method == 'GET') {
                serveGallery(req, res);
            } else if (req.method == 'POST') {
                uploadPicture(req, res);
            }
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
