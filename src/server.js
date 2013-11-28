var http = require("http");
var express = require("express");
var cons = require('consolidate');
var fs = require("fs");

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
        var jsonData = {postsHeader: postBody};

        var outputFilename = dir+postHeader.replace(/[^a-z0-9]/gi, '').toLowerCase()+'.json';
        fs.writeFile(outputFilename, jsonData, function(err) {
            if(err) {
                console.log(err);
            }
        });
        res.redirect("/");
    })

    app.get("/*", function(req, res) {
        res.redirect("/");
    })

    http.createServer(app).listen(app.get('port'), function(){
        console.log("Express server listening on port " + app.get('port'))
    })
}

exports.start = start;