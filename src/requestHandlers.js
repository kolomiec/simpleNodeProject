var querystring = require("querystring"),
    fs = require("fs");


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
    console.log("Request handler 'upload' was called.");

    var form = new formidable.IncomingForm();
    console.log("about to parse");
    form.parse(request, function(error, fields, files) {
        console.log("parsing done");

        /* Возможна ошибка в Windows: попытка переименования уже существующего файла */
        fs.rename(files.upload.path, "/tmp/test.png", function(err) {
            if (err) {
                fs.unlink("/tmp/test.png");
                fs.rename(files.upload.path, "/tmp/test.png");
            }
        });
        response.writeHead(200, {"Content-Type": "text/html"});
        response.write("received image:<br/>");
        response.write("<img src='/show' />");
        response.end();
    });
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