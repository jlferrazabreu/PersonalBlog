define([], function () {
    const blogInstance = localforage.createInstance({
        name: 'blog'
    });

    let oldestBlogPostId = 0;
    const limit = 3;

    async function addPost(post) {
        try {
            const keyValuePair = post.map(function (item) {
                return { key: item.postId, value: item }
            });
            await blogInstance.setItems(keyValuePair);
        } catch (e) {
            console.log(e);
        }
    }

    async function getPosts() {
        try {
            const keys = await blogInstance.keys();
            let index = keys.indexOf(oldestBlogPostId);

            if (index === -1) {
                index = keys.length;
            }
            else if (index === 0) {
                return [];
            }

            const start = index - 3;
            const limitAdjusted = start < 0 ? index : limit;
            const keysSpliced = keys.splice(Math.max(0, start), limitAdjusted);

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

    function getOldestBlogPostId() {
        return oldestBlogPostId;
    }

    return {
        addPost: addPost,
        getPosts: getPosts,
        getOldestBlogPostId: getOldestBlogPostId
    }
});