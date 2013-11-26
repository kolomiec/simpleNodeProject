var http = require("http");
var url = require("url");
var index;

function start(route, handle) {


    function onRequest(request, response) {
        var pathname = url.parse(request.url).pathname;
        console.log("Request for " + pathname + " received.");
        route(handle, pathname, request, response);

//        console.log("Request received.");
//        response.writeHead(200, {"Content-Type": "text/html"});
//        response.write(index);
//        response.end();
    }

    http.createServer(onRequest).listen(8888);
    console.log("Server has started.");
}

exports.start = start;