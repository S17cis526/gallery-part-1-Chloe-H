/** @module template
 */
module.exports = {
    render: render
}

var fs = require('fs');



/** @function render
 * Renders a template with embedded JavaScript
 * @param {string} templateName - the template to render
 * @param {}
 */
function render(templateName, context) {
    var html = fs.readFile('templates/' + templateName + '.html');
    html = html.toString().replace(/<%=(.+)%>/g, function(match, js) {
        return eval("var context = " + JSON.stringify(context) + ";" + js);
    });
    return html;
}
