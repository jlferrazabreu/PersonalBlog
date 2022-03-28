var blogService = require('./blogService.js');
const serviceWorker = require('./swRegister.js');

blogService.loadLatestBlogPosts();

window.pageEvents = {
    loadBlogPost: function (link) {
        blogService.loadBlogPost(link);
    },
    loadMoreBlogPosts: function () {
        blogService.loadMoreBlogPosts();
    }
}