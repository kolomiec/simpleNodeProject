var querystring = require("querystring");
var fs = require("fs");
var util=require('util');
var $ = require('jquery');
var Step = require('step');
var Mustache = require('mustache');
var url = require("url");

var exec = require("child_process").exec;

var dir = '/home/sergeykolomie/tmp/';



function showPosts(request, response) {
    var postsHeaders = {
        postsHeader: []
    };
    var counter = 0;
    Step(
        function readFile() {
            fs.readdir(dir, this);
        },
        function bb(err, files) {
            if (err) {
                counter++;
                renderAllPosts()
            } else {
                if (files.length == 0) {
                    counter++;
                    renderAllPosts();
                }
                files.forEach( function(file) {
                    counter++;
                    fs.readFile(dir+file,'utf-8',function( err, content){
                        if (err) throw err;
                        postsHeaders.postsHeader.push({"header": JSON.parse(content).postHeader});
                        renderAllPosts();
                    });
                });
            }
        }
    );

    function renderAllPosts() {
        counter--;
        if (counter == 0) {
            fs.readFile("./views/posts.html", function (err, htmlContent) {
                if (postsHeaders.postsHeader.length == 0) {
                    var html = Mustache.to_html(htmlContent.toString(), {"content" : "true"});
                } else {
                    var html = Mustache.to_html(htmlContent.toString(), postsHeaders);
                }
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
    var file = param.replace(/[^a-z0-9]/gi, '').toLowerCase()+".json"
    var postDetails = ""
    fs.readFile(dir+file,'utf-8',function( err, details){
        postDetails = details;
        fs.readFile("./views/viewPost.html", function (err, htmlContent) {
            var html = Mustache.to_html(htmlContent.toString(), JSON.parse(postDetails));
            response.writeHead(200, {"Content-Type": "text/html"});
            response.write(html);
            response.end();
        })
    })
}

function removePost(request, response) {
    var param = querystring.parse(url.parse(request.url).query)["fileName"];
    var fileName = param.replace(/[^a-z0-9]/gi, '').toLowerCase()+".json"
    fs.unlink(dir+fileName, function (err) {
        if (err) {
            response.writeHead(302, {
                'Location': '/index'
            });
            response.end();
        }
        console.log('successfully deleted'+dir+fileName);
    });

//    var postData = "";
//
//    request.addListener("data", function(postDataChunk) {
//        postData += postDataChunk;
//    });
//
//    request.on('end', function () {
//        var fileName = querystring.parse(postData).fileName.replace(/[^a-z0-9]/gi, '').toLowerCase()+".json"
//        fs.unlink(dir+fileName, function (err) {
//            if (err) throw err;
//            console.log('successfully deleted'+dir+fileName);
//        });
//
//    });
    response.writeHead(302, {
        'Location': '/showPosts'
    });
    response.end();
}

function editPost(request, response) {
    if (request.method == "GET") {
        var param = querystring.parse(url.parse(request.url).query)["fileName"];
        var file = param.replace(/[^a-z0-9]/gi, '').toLowerCase()+".json"
        var postDetails = ""
        fs.readFile(dir+file,'utf-8',function( err, details){
            postDetails = details;
            fs.readFile("./views/editPost.html", function (err, htmlContent) {
                var html = Mustache.to_html(htmlContent.toString(), JSON.parse(postDetails));
                response.writeHead(200, {"Content-Type": "text/html"});
                response.write(html);
                response.end();
            })
        })
    } else {
        var param = querystring.parse(url.parse(request.url).query)["fileName"];
        var fileName = param.replace(/[^a-z0-9]/gi, '').toLowerCase()+".json"
        fs.unlink(dir+fileName, function (err) {});

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
            'Location': '/showPosts'
        });
        response.end();
    }

}



exports.index = index;
exports.createPost = createPost;
exports.showPosts = showPosts;
exports.showPostDetails = showPostDetails;
exports.removePost = removePost;
exports.editPost = editPost;