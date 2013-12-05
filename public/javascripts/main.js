$(function(){

    function getPostCreateForm() {
        $.ajax({
            url: "/createForm",
            context: document.body
        }).done(function(data) {
            $("body .container").empty();
            $("body .container").append(data);
        });
    };

    function displayPosts() {
        $.ajax({
            url: "/getPosts",
            context: document.body
        }).done(function(data) {
            var post = new Post();
            var posts = new PostCollection(data);
            var postsView = new PostsView({collection: posts})
            $("body .container").empty();
            $("body .container").append(postsView.el);
        });
    };

    function displayPostDetails(data) {
        var postView = new PostView({model: data});
        postView.template = _.template( $("#post-edit").html() );
        postView.render();
        $("body .container").empty();
        $("body .container").append(postView.el);
    };

    var Post = Backbone.Model.extend({});

    var PostCollection = Backbone.Collection.extend({
        model: Post
    });

    var PostsView = Backbone.View.extend({
        tagName: "div",

        initialize: function() {
            this.render();
        },

        render: function() {
            this.collection.each(function(post) {
                var postView = new PostView({model: post.toJSON()});
                postView.template = _.template( $("#post").html() );
                postView.render();
                this.$el.append(postView.el);
            }, this);
        }
    })


    var PostView = Backbone.View.extend({
        tagName: 'div',

        render: function() {
            this.$el.html( this.template(this.model) )
        },
        events: {
            'click .edit-post': 'editPost',
            'click .delete-post': 'deletePost',
            'click .save-post': 'savePost',
            'click .back': 'showPosts',
            'click .review-post': 'reviewPost'
        },
        editPost: function() {
            $.ajax({
                url: "/edit",
                data: { fileName: this.$el.find('.post-header').text() }
            }).done(function(data){
                displayPostDetails(data);
            })
        },

        deletePost: function() {
            $.ajax({
                url: "/delete",
                data: { fileName: this.$el.find('.post-header').text() }
            }).done(function(data){
                displayPosts();
            })
        },

        savePost: function() {
            $.ajax({
                type: "POST",
                url: "/edit",
                data: { fileName: this.$el.find('input').val(), postHeader: this.$el.find('input').val(), postBody: this.$el.find('textarea').val()}
            }).done(function(data){
                displayPosts();
            })
        },

        showPosts: function() {
            displayPosts();
        },

        reviewPost: function() {

        }
    });

    var Router = Backbone.Router.extend({
        routes: {
            '': 'home',
            'create': 'home',
            'showPosts': 'showPosts',
            '*xyz': 'showError'
        }
    })

    var router = new Router();
    router.on('route:home', function(){
        getPostCreateForm();
    });

    router.on('route:showPosts', function(){
        displayPosts();
    });

    router.on('route:showError', function(data){
        $("body .container").empty();
        $("body .container").append($("#error-page").html());
    });

    Backbone.history.start();

});