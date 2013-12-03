var http = require("http");
var express = require("express");
var cons = require('consolidate');
var fs = require("fs");
var Step = require('step');
var Mustache = require('mustache');

var app = express();
var dir = '/home/sergeykolomie/tmp/';

function start() {

    app.configure(function(){
        app.set('port', process.env.PORT || 8888);
        app.set('view engine', 'html');
        app.engine('html', cons.mustache);

        app.use(express.bodyParser());
        app.use(app.router);

        app.use(express.static(__dirname + '/public'));
    })

    app.get("/", function(req, res) {
        res.render('index', {});
    })

    app.get("/index", function(req, res) {
        res.redirect("/");
    })

    app.post("/createPost", function(req, res) {
        var postHeader = req.body.postHeader;
        var postBody = req.body.postBody;
        var jsonData = {postHeader: postHeader, postBody: postBody};

        var outputFilename = dir+postHeader.replace(/[^a-z0-9]/gi, '').toLowerCase()+'.json';
        fs.writeFile(outputFilename, JSON.stringify(jsonData), function(err) {
            if(err) {
                console.log(err);
            }
        });
        res.redirect("/");
    })

    app.get("/showPosts", function(req, res) {
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
                    res.writeHead(200, {"Content-Type": "text/html"});
                    res.write(html);
                    res.end();
                })
            }
        }
    })

    app.get("/showPostDetails", function(req, res) {
        var param = req.param("fileName");
        var file = param.replace(/[^a-z0-9]/gi, '').toLowerCase()+".json"
        var postDetails = ""
        fs.readFile(dir+file,'utf-8',function( err, details){
            postDetails = details;
            fs.readFile("./views/viewPost.html", function (err, htmlContent) {
                var html = Mustache.to_html(htmlContent.toString(), JSON.parse(postDetails));
                res.writeHead(200, {"Content-Type": "text/html"});
                res.write(html);
                res.end();
            })
        })
    })

    app.get("/editPost", function(req, res) {
        var param = req.param("fileName");
        var file = param.replace(/[^a-z0-9]/gi, '').toLowerCase()+".json"
        var postDetails = ""
        fs.readFile(dir+file,'utf-8',function( err, details){
            postDetails = details;
            fs.readFile("./views/editPost.html", function (err, htmlContent) {
                var html = Mustache.to_html(htmlContent.toString(), JSON.parse(postDetails));
                res.writeHead(200, {"Content-Type": "text/html"});
                res.write(html);
                res.end();
            })
        })
    })

    app.post("/editPost", function(req, res) {
        var param = req.param("fileName");
        var fileName = param.replace(/[^a-z0-9]/gi, '').toLowerCase()+".json"
        fs.unlink(dir+fileName, function (err) {});

        var postHeader = req.body.postHeader;
        var postBody = req.body.postBody;
        var jsonData = {postHeader: postHeader, postBody: postBody};

        var outputFilename = dir+postHeader.replace(/[^a-z0-9]/gi, '').toLowerCase()+'.json';
        fs.writeFile(outputFilename, JSON.stringify(jsonData), function(err) {
            if(err) {
                console.log(err);
            }
        });
        res.redirect("/showPosts");
    })

    app.get("/removePost", function(req, res) {
        var param = req.param("fileName");
        var fileName = param.replace(/[^a-z0-9]/gi, '').toLowerCase()+".json"
        fs.unlink(dir+fileName, function (err) {
            if (err) {
                res.redirect('/index');
            }
            console.log('successfully deleted'+dir+fileName);
        });

        res.redirect('/showPosts');
    })



    app.get("/*", function(req, res) {
        res.redirect("/");
    })

    http.createServer(app).listen(app.get('port'), function(){
        console.log("Express server listening on port " + app.get('port'))
    })
}

exports.start = start;