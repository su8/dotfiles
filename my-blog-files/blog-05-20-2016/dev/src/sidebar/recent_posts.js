geminiBlog.RecentPostsTemplate = [
    "<div class='recent-posts-wrapper'>",
        "<a class='list-group-item'></a>",
    "</div>"
].join('');

geminiBlog.createRecentPosts = function(entry) {
    var snippetViewHTML = utils.str2WrappedDOMElement(geminiBlog.RecentPostsTemplate);
    var wrapper = $('.recent-posts-wrapper', snippetViewHTML);
    wrapper.setAttribute('id', entry.id);
    //wrapper.setAttribute("onclick", "document.location.href = '#!post=" + entry.id + "'");

    //set title
    $('.list-group-item', wrapper).setAttribute("href", "#!post=" + entry.id);
    $('.list-group-item', wrapper).textContent = (entry.title.length > 35) ? entry.title.slice(0, 35) + "...": entry.title;

    return snippetViewHTML.childNodes[0];

};

geminiBlog.showRecentPosts = function() {
    if (geminiBlog.showRecentBar) {
        var entries = geminiBlog.entries.slice(0, geminiBlog.recentPosts);
        var recent_container = utils.clearElements($("#recent-posts"));

        entries.forEach(function(entry) {
            recent_container.appendChild(geminiBlog.createRecentPosts(entry));
        });
    } else {
        utils.hide($('#recentBar'));
    }
    geminiBlog.showTags();
};
