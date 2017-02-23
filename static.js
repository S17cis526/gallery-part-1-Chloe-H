/** @module static
  * Loads and serves static files
  */

module.exports = {
    loadDir: loadDir,
    isCached: isCached,
    serveFile: serveFile
};

var files = {};
var fs = require('fs');

function loadDir(directory) {
    var items = fs.readdirSync(directory);
    items.forEach(function(item) {
        var path = directory + '/' + item;
        var stats = fs.statSync(path);
        if (stats.isFile()) {
            var parts = path.split('.');
            var extension = parts[parts.length - 1];
            var type = 'application/octet-stream'; // MIME type for binary files
            switch (extension) {
                case 'css':
                case 'CSS':
                    type = 'text/css';
                    break;
                case 'js':
                case 'JS':
                    type = 'text/javascript';
                    break;
                case 'jpg':
                case 'JPG':
                case 'jpeg':
                case 'JPEG':
                    type = 'image/jpeg';
                    break;
                case 'png':
                case 'PNG':
                case 'gif':
                case 'GIF':
                case 'bmp':
                case 'BMP':
                case 'tiff':
                case 'TIFF':
                case 'svg':
                case 'SVG':
                    type = 'image/' + extension;
                    break;
                    // default case would just be the init value we gave 'type'
            }
            files[path] = {
                contentType: type,
                data: fs.readFileSync(path)
            };
        }
        if (stats.isDirectory()) {
            loadDir(path); // this would kill us if there are cycles due to symbolic links, of course
        }
    });
}

function isCached(path) {
    return files[path] != undefined; // forces result to be truly boolean rather than truthy or falsey - good practice when a boolean result is expected
}

function serveFile(path, req, res) {
    res.statusCode = 200;
    res.setHeader('Content-Type', files[path].contentType);
    res.end(files[path].data);
}
