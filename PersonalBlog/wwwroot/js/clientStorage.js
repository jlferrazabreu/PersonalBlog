define([], function () {

    const blogInstance = localforage.createInstance({
        name: 'blog'
    });

    let oldestBlogPostId = 0;
    const limit = 3;

    async function addPost(posts) {
        try {
            const keyValuePair = posts.map(function (item) {
                return { key: item.postId, value: item }
            });
            await blogInstance.setItems(keyValuePair);
        } catch (e) {
            console.log(e);
        }
    }

    async function addPostText(link, text) {
        try {
            return await blogInstance.setItem('#' + link, text);
        } catch (e) {
            console.log(e);
        }
    }

    async function getPosts() {
        try {
            const keys = await blogInstance.keys();
            const keysWithoutLinks = keys.filter(function (item) {
                return !item.toString().includes('#');
            });
            let index = keysWithoutLinks.indexOf(oldestBlogPostId);

            if (index === -1) {
                index = keysWithoutLinks.length;
            } else if (index === 0) {
                return [];
            }

            const start = index - 3;
            const limitAdjuted = start < 0 ? index : limit;
            const keysSpliced = keysWithoutLinks.splice(Math.max(0, start), limitAdjuted);

            const items = await blogInstance.getItems(keysSpliced);
            if (items) {
                const posts = Object.keys(items).map(function (k) {
                    return items[k];
                }).reverse();

                oldestBlogPostId = posts[posts.length - 1].postId;

                return posts;
            }
        } catch (e) {
            console.log(e);
        }
    }

    async function getPostText(link) {
        try {
            return await blogInstance.getItem('#' + link);
        } catch (e) {
            console.log(e);
        }
    }

    function getOldestBlogPostId() {
        return oldestBlogPostId;
    }

    return {
        addPost: addPost,
        addPostText: addPostText,
        getPosts: getPosts,
        getPostText: getPostText,
        getOldestBlogPostId: getOldestBlogPostId
    }
});
