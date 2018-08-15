geminiBlog.searchOrLogView = function(searchMode) {
    document.title = searchMode ? geminiBlog.searchTitle : 'Getta outta here';
    var container = utils.clearElements($("#entries-wrapper"));
    var message = searchMode ? 'Nothing Found.' : 'You are not logged-in.';

    var rantTemplate = [
        "<div class='oh-rant-snap'>",
            "<hr>",
                "<div class='alert alert-info'>"+ message +"</div>",
            "<hr>",
        "</div>"
    ].join('');

    var ViewHTML = utils.str2WrappedDOMElement(rantTemplate);

    geminiBlog.showRecentPosts();

    if (searchMode) {
        var foundPosts = false;
        var uzerQuery = utils.elemId("uzer-infut").value.toLowerCase();

        geminiBlog.entries.forEach(function(entry) {
            if (entry.title.toLowerCase().match(uzerQuery)) {
                container.appendChild(geminiBlog.createArchiveHtml(entry, false));
                foundPosts = true;
            }
        });

        if (!foundPosts) {
            container.appendChild(ViewHTML.childNodes[0]);
        }
    } else {
        if (localStorage.getItem('uzerHackedIn'))
            return false;
        else {
            utils.show($('#loginForm'));
            geminiBlog.hackButton = true;
            container.appendChild(ViewHTML.childNodes[0]);
            return true;
        }
    }

};
