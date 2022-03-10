define(['./template.js', '../lib/showdown/showdown.js', './clientStorage.js'], function (template, showdown, clientStorage) {

    const blogPostsUrl = '/Home/LatestBlogPosts/';
    const blogPostUrl = '/Home/Post/?link=';
    const loadMorePostsUrl = '/Home/MoreBlogPosts/?oldestBlogPostId=';

    async function loadData(url) {
        let connectionStatus = '';
        try {
            const response = await fetch(url);
            const json = await response.json();
            clientStorage.addPost(json);
            connectionStatus = 'Conexao com a API OK';
        } catch (e) {
            console.log('Erro ao carregar data: ', e);
            connectionStatus = 'Nao foi possivel buscar dados na API';
        }

        const posts = await clientStorage.getPosts();
        template.appendBlogList(posts);
        $('#connection-status').html('connectionStatus');
    }

    async function loadLatestBlogPosts() {
        await loadData(blogPostsUrl);
    }

    function loadBlogPost(link) {
        fetch(blogPostUrl + link)
            .then(function (response) {
                return response.text();
            })
            .then(function (data) {
                const converter = new showdown.Converter();
                html = converter.makeHtml(data);
                template.showBlogItem(html, link);
                window.location = '#' + link;
            })
            .catch(function (error) {
                console.log('Erro ao carregar')
            });
    }

    async function loadMoreBlogPosts() {
        await loadData(loadMorePostsUrl + clientStorage.getOldestBlogPostId());
    }

    return {
        loadLatestBlogPosts: loadLatestBlogPosts,
        loadBlogPost: loadBlogPost,
        loadMoreBlogPosts: loadMoreBlogPosts
    }
});
