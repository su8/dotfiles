geminiBlog.detailsViewTemplate = [
    "<article class='details-wrapper'>",
        "<div class='details-head'>",
            "<div class='details-head-wrapper'>",
                "<span class='details-separator'> » </span>",
                "<span class='details-date label label-default'></span>",
            "</div>",
        "</div>",
        "<div class='details-body'>",
        "</div>",
        "<div class='details-footer'>",
            "<hr>",
            "<div class='markdown-source'>",
                "( The source markdown file for this entry can be found <a id='md-src'>Here</a> )",
            "</div>",
            "<ul class='pager'>",
                "<li class='previous'>",
                    "<a id='previous-link'>&larr; Older</a>",
                "</li>",
                "<li class='next'>",
                    "<a id='next-link'>Newer &rarr;</a>",
                "</li>",
            "</ul>",
        "</div>",
    "</article>"
].join('');

geminiBlog.createDetails = function(entry) {
    var detailsViewHTML = utils.str2WrappedDOMElement(geminiBlog.detailsViewTemplate);

    var head = $('.details-head-wrapper', detailsViewHTML);

    //set title
    //$('.details-title', head).setAttribute("href", "#!post=" + entry.id);
    $('.details-date', head).setAttribute("id", entry.id);
    //$('.details-title', head).textContent = entry.title;
    $('.details-date', head).textContent = "Posted by " + entry.author +
        " on " + entry.pubDate.toLocaleDateString();

    //set content
    $('.details-body', detailsViewHTML).innerHTML = entry.html;

    //footer
    var footer = $('.details-footer', detailsViewHTML);

    //markdown source
    if(geminiBlog.markDownloads) {
        $('#md-src', footer).setAttribute('href', entry.url);
    } else {
        utils.hide($('.markdown-source', footer));
    }

    if (geminiBlog.prevnextLinks)
    {
        // previous link
        if (entry.index > 0) {
            $('#previous-link', footer).setAttribute("href", "#!post=" + geminiBlog.getEntryBy(false, 'index', entry.index - 1).id);
            $('#previous-link', footer).setAttribute("title", geminiBlog.getEntryBy(false, 'index', entry.index - 1).title);
        } else {
            // remove link
            utils.hide($('#previous-link', footer));
        }
        // next link
        if (entry.index < geminiBlog.entries.length - 1) {
            $('#next-link', footer).setAttribute("href", "#!post=" + geminiBlog.getEntryBy(false, 'index', entry.index + 1).id);
            $('#next-link', footer).setAttribute("title", geminiBlog.getEntryBy(false, 'index', entry.index + 1).title);
        } else {
            // remove link
            utils.hide($('#next-link', footer));
        }
    } else {
        utils.hide($('#next-link', footer));
        utils.hide($('#previous-link', footer));
    }

    // console.log(detailsViewHTML.innerHTML);
    return detailsViewHTML.childNodes[0];
};

geminiBlog.detailsView = function(entry, containerClass) {
    document.title = entry.title;
    var container = utils.clearElements($(containerClass || "#entries-wrapper"));

    geminiBlog.showRecentPosts();

    var detailsViewInstructions = function(entry) {
        //create and add snippet
        //console.log("Loaded entry: " + entry.index + ": " + entry.title + " " + entry.pubDate.toLocaleDateString());
        container.appendChild(geminiBlog.createDetails(entry));

        // scroll(0,posTop); // scroll to top after the entry loads, set the px value in config depending on header height
        // scroll upto entry.id anchor, markdown heading is just below
        utils.elemId(entry.id).scrollIntoView(true);
    };

    // fetch entry and process
    if (!entry.text) {
        utils.ajax({
            method: "GET",
            url: entry.url,
            mimeType: "text/plain; charset=x-user-defined",
            success: function(xhr) {
                //console.log('processEntry(): Status: ' + xhr.status);
                entry.text = xhr.responseText;
                entry.html = geminiBlog.mdToHTML(xhr.responseText);

                //generate
                detailsViewInstructions(entry);

            },
            error: function() {
                console.log("err");
                return false;
            }
        });
    } else {
        //create and add details
        detailsViewInstructions(entry);
    }
};
