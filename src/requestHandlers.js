var querystring = require("querystring");
var fs = require("fs");
var util=require('util');
var $ = require('jquery');
var Step = require('step');
var Mustache = require('mustache');
var url = require("url");

var exec = require("child_process").exec;

var dir = '/home/sergeykolomie/tmp/';

function getHTML(viewName, request, response) {
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

function index(request, response) {
    getHTML("index.html", request, response)
}

function createPost(request, response) {
    var postData = "";
    var jsonData = ""
    var postHeader = ""

    request.addListener("data", function(postDataChunk) {
        postData += postDataChunk;
    });

    request.on('end', function () {
        jsonData = JSON.stringify(querystring.parse(postData));
        postHeader = querystring.parse(postData).postHeader;

        var outputFilename = dir+postHeader.replace(/[^a-z0-9]/gi, '').toLowerCase()+'.json';
        fs.writeFile(outputFilename, jsonData, function(err) {
            if(err) {
                console.log(err);
            }
        });
    });

    response.writeHead(302, {
        'Location': '/index'
    });
    response.end();

}

function showPosts(request, response) {
    var postsHeaders = {
        postsHeader: [],
        postsFileName: []
    };
    var counter = 0;
    Step(
        function readFile() {
            fs.readdir(dir, this);
        },
        function bb(err, files) {
            if (err) throw err;
            files.forEach( function(file) {
                counter++;
                fs.readFile(dir+file,'utf-8',function( err, content){
                    if (err) throw err;
                    postsHeaders.postsHeader.push({"header": JSON.parse(content).postHeader});
                    postsHeaders.postsFileName.push({"name": file});
                    renderAllPosts();
                });
            });
        }
    );

    function renderAllPosts() {
        counter--;
        if (counter == 0) {
            fs.readFile("./views/posts.html", function (err, htmlContent) {
                var html = Mustache.to_html(htmlContent.toString(), postsHeaders);
                response.writeHead(200, {"Content-Type": "text/html"});
                response.write(html);
                response.end();
                console.log(postsHeaders);
            })
        }
    }
}

function showPostDetails(request, response) {
    var param = querystring.parse(url.parse(request.url).query)["fileName"];
    var file = param+".json"
    var postDetails = ""
    fs.readFile(dir+file,'utf-8',function( err, details){
        postDetails = details;
        fs.readFile("./views/viewPost.html", function (err, htmlContent) {
            var html = Mustache.to_html(htmlContent.toString(), JSON.parse(postDetails));
//            var html = Mustache.to_html(htmlContent.toString(), );
            response.writeHead(200, {"Content-Type": "text/html"});
            response.write(html);
            response.end();
        })
    })
}


exports.index = index;
exports.createPost = createPost;
exports.showPosts = showPosts;
exports.showPostDetails = showPostDetails;