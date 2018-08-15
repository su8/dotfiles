geminiBlog.snippetViewTemplate = [
    "<div class='snippet-wrapper'>",
        "<h4 class='entry-title'>",
            "<a class='snippet-title text-muted'></a>",
        "</h4>",
        "<hr>",
    "</div>"
].join('');


geminiBlog.createSnippet = function(entry, sliceAmount) {
    sliceAmount = sliceAmount || geminiBlog.snippetLength;

    var snippetViewHTML = utils.str2WrappedDOMElement(geminiBlog.snippetViewTemplate);
    var wrapper = $('.snippet-wrapper', snippetViewHTML);
    wrapper.setAttribute('id', entry.id);
    //wrapper.setAttribute("onclick", "document.location.href = '#!post=" + entry.id + "'");

    var head = $('.entry-title', wrapper);

    //set title
    $('.snippet-title', head).setAttribute("href", "#!post=" + entry.id);
    $('.snippet-title', head).textContent = (entry.title.length > 35) ? entry.title.slice(0, 35) + "...": entry.title;

    // console.log(snippetViewHTML.innerHTML);
    // return inner dom
    return snippetViewHTML.childNodes[0];
};

geminiBlog.snippetView = function(entries, containerClass, sliceLength) {
    document.title = geminiBlog.blogTitle;
    entries = entries || geminiBlog.entries.slice(0, geminiBlog.frontPosts);
    sliceLength = sliceLength || geminiBlog.frontPosts;
    var container = utils.clearElements($(containerClass || "#entries-wrapper"));

    geminiBlog.showRecentPosts(); // show the sidebars first

    entries.forEach(function(entry, index) {
            if (index === sliceLength) {return;}
            container.appendChild(geminiBlog.createSnippet(entry));
    });
};
