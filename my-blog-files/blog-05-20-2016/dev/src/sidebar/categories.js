geminiBlog.tagTemplate = [
    "<div class='tags-wrapper'>",
        "<a class='list-group-item'></a>",
    "</div>",
].join('');

geminiBlog.showTags = function() {
    if (geminiBlog.showCategories && !geminiBlog.CategoriesEmpty) {
        var entries = geminiBlog.tags;
        var tagsContainer = utils.clearElements($("#tags-div"));

        entries.forEach(function(entry) {
            tagsContainer.appendChild(geminiBlog.createTagsView(entry));
        });
    } else {
        utils.hide($('#CategoriesBar'));
    }

    //geminiBlog.showKernels();
    geminiBlog.detectOS();
};

geminiBlog.createTagsView = function(tag) {
    var snippetViewHTML = utils.str2WrappedDOMElement(geminiBlog.tagTemplate);
    var wrapper = $('.tags-wrapper', snippetViewHTML);
    wrapper.setAttribute('id', tag);
    //wrapper.setAttribute("onclick", "document.location.href = '#!tag=" + tag + "'");

    //category href and "badge" to show how many entires are in it
    $('.list-group-item', wrapper).setAttribute("href", "#!tag=" + tag);
    $('.list-group-item', wrapper).innerHTML = utils.capFirst(tag) + "<span class='badge'>" +
        geminiBlog.getEntryBy(true, tag).length + "</span>";

    return snippetViewHTML.childNodes[0];
};
