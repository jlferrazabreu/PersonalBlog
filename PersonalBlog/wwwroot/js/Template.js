define([], function () {

    function generateBlogItem(item) {
        let template = $('#blog-card').html();
        template = template.replace('{{PostId}}', item.postId);
        template = template.replace('{{Title}}', item.title);
        template = template.replace('{{ShortDescription}}', item.shortDescription);
        template = template.replace('{{Link}}', item.link);

        return template;
    }

    function appendBlogList(items, oldestBlogPostId) {
        let cardHtml = '';
        for (let i = 0; i < items.length; i++) {
            cardHtml += generateBlogItem(items[i]);
        }

        $('#blog-list').append(cardHtml);

        if (oldestBlogPostId > 1) {
            $('#carregar-mais').show();
        } else {
            $('#carregar-mais').hide();
        }
    }

    function showBlogItem(html, link) {
        let template = $('#blog-item').html();
        template = template.replace('{{Link}}', link);
        template = template.replace('{{Content}}', html);
        $('#blog-item-container').html(template);
    }

    return {
        appendBlogList: appendBlogList,
        showBlogItem: showBlogItem
    }
});