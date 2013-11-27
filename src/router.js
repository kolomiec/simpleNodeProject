var fs = require("fs");

function route(handle, pathname, request, response) {
    console.log("About to route a request for " + pathname);
    if (typeof handle[pathname] === 'function') {
        handle[pathname](request, response);
    } else {
        fs.readFile("."+pathname,'utf-8',function( err, fileContent) {
            if (err) {
                console.log("No request handler found for " + pathname);
                response.writeHead(404, {"Content-Type": "text/html"});
                response.write("404 Not found");
                response.end();
            } else {
                response.writeHead(200, {"Content-Type": "text/html"});
                response.write(fileContent);
                response.end();
            }
        })
    }
}

exports.route = route;