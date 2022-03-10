var blogService = require('./blogService.js');

blogService.loadLatestBlogPosts();

window.pageEvents = {
    loadBlogPost: function (link) {
        blogService.loadBlogPost(link);
    },
    loadMoreBlogPosts: function () {
        blogService.loadMoreBlogPosts();
    }

}