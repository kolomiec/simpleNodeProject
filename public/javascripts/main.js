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
        console.log(postView);
        console.log("123123");
        console.log(postView.el);
//        $("body .container").empty();
//        $("body .container").append(postView.el);
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
                var postView = new PostView({model: post});
                this.$el.append(postView.el);
            }, this);
        }
    })


    var PostView = Backbone.View.extend({
        tagName: 'div',
        template: _.template( $("#post").html()),

        initialize: function() {
            this.render();
        },

        render: function() {
            this.$el.html( this.template(this.model.toJSON()) )
        },
        events: {
            'click .edit-post': 'editPost',
            'click .delete-post': 'deletePost'
        },
        editPost: function() {
            $.ajax({
                url: "/edit",
                data: { fileName: this.$el.find('span strong').text() }
            }).done(function(data){

            })
        },

        deletePost: function() {
            $.ajax({
                url: "/delete",
                data: { fileName: this.$el.find('span strong').text() }
            }).done(function(data){
                    displayPostDetails(data);
            })
        }
    });


    $(".create").click(function(){
        getPostCreateForm();
    });

    $(".show-posts").click(function(){
        displayPosts();
    });

    getPostCreateForm();
});