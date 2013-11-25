var querystring = require("querystring");
var fs = require("fs");
var util=require('util');


function getHTML(viewName, response, request) {
    var viewPath = "./views/"+viewName;
    fs.readFile(viewPath, function (err, data) {
        if (err) {
            throw err;
        }
        response.writeHead(200, {"Content-Type": "text/html"});
        response.write(data);
        response.end();
    });
}

function index(response, request) {
    getHTML("index.html", response, request)
}

function createPost(response, request) {
    var postData = "";

    request.addListener("data", function(postDataChunk) {
        postData += postDataChunk;
        console.log("Received POST data chunk '"+
            postDataChunk + "'.");
    });
    request.on('end', function () {
        util.inspect(querystring.parse(postData));
    });

    response.writeHead(302, {
        'Location': '/index'
        //add other headers here...
    });
    response.end();

}

function showPost(response) {
    console.log("Request handler 'show' was called.");
    fs.readFile("/tmp/test.png", "binary", function(error, file) {
        if(error) {
            response.writeHead(500, {"Content-Type": "text/plain"});
            response.write(error + "\n");
            response.end();
        } else {
            response.writeHead(200, {"Content-Type": "image/png"});
            response.write(file, "binary");
            response.end();
        }
    });
}

exports.index = index;
exports.createPost = createPost;
exports.show = showPost;