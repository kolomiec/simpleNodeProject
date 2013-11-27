var server = require("./src/server");
var router = require("./src/router");
var requestHandlers = require("./src/requestHandlers");

var handle = {}
handle["/"] = requestHandlers.index;
handle["/index"] = requestHandlers.index;
handle["/createPost"] = requestHandlers.createPost;
handle["/showPosts"] = requestHandlers.showPosts;
handle["/showPostDetails"] = requestHandlers.showPostDetails;
handle["/removePost"] = requestHandlers.removePost;
handle["/editPost"] = requestHandlers.editPost;


server.start(router.route, handle);