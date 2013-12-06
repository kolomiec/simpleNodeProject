var mongoose = require('mongoose');
var config = require('../conf/config.js');

mongoose.connect('mongodb://localhost/postDB');
var db = mongoose.connection;

db.on('error', function (err) {
    console.log('connection error:' + err.message);
});
db.once('open', function callback () {
    console.log("Connected to DB!");
});

var posts = new mongoose.Schema({
    postHeader: { type: String, required: true },
    postBody: { type: String, required: true }
});

var Post = mongoose.model('Post', posts);

module.exports = Post;