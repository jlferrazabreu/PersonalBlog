define(['./template.js', '../lib/showdown/showdown.js', './clientStorage.js'], function (template, showdown, clientStorage) {

    const blogPostsUrl = '/Home/LatestBlogPost/';
    const blogPostUrl = '/Home/Post/?link=';
    const loadMorePostsUrl = '/Home/MoreBlogPosts/?oldestBlogPostId=';

    async function loadData(url, link, isText) {
        let connectionStatus = '';
        link = link || '';
        try {
            const response = await fetch(url + link);
            if (isText) {
                const text = await response.text();
                await clientStorage.addPostText(link, text);
            } else {
                const json = await response.json();
                await clientStorage.addPost(json);
            }

            connectionStatus = 'Conexao com a API ok';
        } catch (e) {
            console.log('Error ao carregar data: ', e);
            connectionStatus = 'Nao foi possivel buscar dados na API, vamos seguir offline';
        }

        $('#connection-status').html(connectionStatus);
    }

    async function loadPostsData(url) {
        await loadData(url);
        const posts = await clientStorage.getPosts();
        if (posts && posts.length > 0) {
            const oldestBlogPostId = clientStorage.getOldestBlogPostId();
            template.appendBlogList(posts, oldestBlogPostId);
        } else {
            $('#connection-status').html('Nao ha mais posts em cache para exibir');
            window.location = '#connection-status';
        }
    }

    async function loadLatestBlogPosts() {
        await loadPostsData(blogPostsUrl);
    }

    async function loadBlogPost(link) {
        await loadData(blogPostUrl, link, true);
        const text = await clientStorage.getPostText(link);
        if (text) {
            const converter = new showdown.Converter();
            const html = converter.makeHtml(text);
            template.showBlogItem(html, link);
            window.location = '#' + link;
        } else {
            let blogItemHtml = $('#blog-content-not-found').html().replace(/{{Link}}/g, link);
            template.showBlogItem(blogItemHtml, link);
            window.location = '#blog-item-container';
        }
    }

    async function loadMoreBlogPosts() {
        await loadPostsData(loadMorePostsUrl + clientStorage.getOldestBlogPostId());
    }

    return {
        loadLatestBlogPosts: loadLatestBlogPosts,
        loadBlogPost: loadBlogPost,
        loadMoreBlogPosts: loadMoreBlogPosts
    }
});
