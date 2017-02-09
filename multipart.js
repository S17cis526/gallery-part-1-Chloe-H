/**
 * @module multipart
 * A module for processing multipart HTTP requests.
 */

"use strict;"

module.exports = multipart;

const DOUBLE_CRLF = Buffer.from([0x0D,0x0A,0x0D,0x0A]);

/**
 * @function multipart
 * Takes a request and response object,
 * parses the body of the multipart request,
 * and attaches its contents to the request
 * object. If an error occurs, we log it
 * and send a 500 status code. Otherwise,
 * we invoke next with the request and response.
 */
function multipart(req, res, next) {
    var chunks = [];

    req.on('error', function(err) {
        console.error(err);
        res.statusCode = 500;
        res.end();
    });

    req.on('data', function(chunk) {
        chunks.push(chunk);
    });

    req.on('end', function() {
        // TODO: var boundary = req.headers["ContentType"];
        // on the website
        var buffer = Buffer.concat(chunks);
        req.body = processBody(buffer, boundary);
        next(req, res);
    });
    /*
    // from the online lecture notes
    req.on('end', function() {
        var body = Buffer.concat(chunks);
        var match = /boundary=(.+);?/.exec(req.headers['content-type']);

        if(match && match[1]) {
            callback(false, processBody(body, match[1]));
        }
        else {
            callback("No multipart boundary defined.");
        }
    });
    */
}

/**
 * @function processBody
 * Takes a buffer and a boundary and
 * returns an associative array of
 * key/value pairs; if content is a
 * file, value will be an object with
 * properties filename, contentType, and
 * data.
 */
function processBody(buffer, boundary) {
    var contents = [];
    // finds the 1st instance of the boundary bytes, then adds the length of the boundary and 2 for CRLF so 'start' gives the index of the first content chunk
    var start = buffer.indexOf(boundary) + boundary.length + 2;
    var end = buffer.indexOf(boundary, start); // end of content index

    while (end > start) {
        contents.push(buffer.slice(start, end));
        start = end + boundary.length + 2;
        end = buffer.indexOf(boundary, start);
    }

    var parsedContents = {};
    contents.forEach(function(content) {
        parseContent(content, function(err, tuple) {
            if (err) {
                return console.error(err); // quietly throw out bad elements
            }

            parsedContents[tuple[0]] = tuple[1];
        });
    });

    return parsedContents;
}

/**
 * @function parseContent
 * Parses a content section and returns
 * the key/value pair as a two-element array.
 */
function parseContent(content, callback) {
    var index = content.indexOf(DOUBLE_CRLF);
    var head = content.slice(0, index).toString();
    var body = content.slice(index + 4); // because there are 4 bytes in the double CRLF
    var name = /name="([\w\d\-_]+)"/.exec(head);
    var filename = /filename="([\w\d\-_\.]+)"/.exec(head);
    var contentType = /Content-Type: ([\w\d\/]+)/.exec(head);

    if (!name) {
        return callback("Content without name");
    }

    if (filename) {
        // we have a file
        callback(false, [name[1], {
            filename: filename[1],
            contentType: (contentType) ? contentType[1] : 'application/octet-stream',
            data: body /* leave the body as a buffer */
        }]);
    }
    else {
        // we have a value
        callback(false, [name[1], body.toString()]);
    }
}
