geminiBlog.archiveViewTemplate = [
    "<div class='page-header'>",
        "<h4 class='post-title'>",
            "<a class='post-title-url text-muted'></a>",
        "</h4>",
        "<p class='meta text-muted'>",
            "<span class='archive-post-separator'> » </span>",
            "<span class='post-date label label-default'></span>",
        "</p>",
    "</div>"
].join('');


geminiBlog.archiveView = function(givenArr, windowTitle, edit_mode) {
    document.title = windowTitle || geminiBlog.archiveTitle;
    scroll(0,0); // scroll to top, useful when on mobile device
    var container = utils.clearElements($("#entries-wrapper"));
    var entries = givenArr || geminiBlog.entries;

    entries.forEach(function(entry) {
        container.appendChild(geminiBlog.createArchiveHtml(entry, edit_mode));
    });
    geminiBlog.showRecentPosts();
};

geminiBlog.createArchiveHtml = function(entry, edit_mode) {
    var archiveViewHTML = utils.str2WrappedDOMElement(geminiBlog.archiveViewTemplate);
    var wrapper = $('.page-header', archiveViewHTML);
    //wrapper.setAttribute("onclick", "document.location.href = '#!post=" + entry.id + "'");

    var head = wrapper; //$('.archive-head', wrapper);

    //set title
    $('.post-title-url', head).setAttribute("href",
            edit_mode ? "#!edit=" + entry.url :
            "#!post=" + entry.id);
    $('.post-title-url', head).textContent = (entry.title.length > 35) ? entry.title.slice(0, 35) + "...": entry.title;
    $('.post-date', head).textContent = entry.pubDate.toLocaleDateString();

    // return inner dom
    return archiveViewHTML.childNodes[0];
};
