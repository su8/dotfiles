/* currently not in use */

/*geminiBlog.RecentKernelsTemplate = [
    "<div class='recent-kernels-wrapper'>",
        "<button type='button' class='list-group-item'></button>",
    "</div>"
].join('');

geminiBlog.showKernels = function() {
    var container = utils.clearElements($("#kernels"));

    if (geminiBlog.showKernelsBar) {
        if (geminiBlog.kernelsFirstLoad) {
            utils.ajax({
                method: "GET",
                url: "https://www.kernel.org/feeds/kdist.xml",
                success: function(xhr) {
                    var tag, x, release_version;

                    geminiBlog.kernelsFirstLoad = true;
                    tag = xhr.responseXML.getElementsByTagName("guid");

                    for (x = 0; x < 5; x++) {
                        release_version = tag[x].childNodes[0].nodeValue.split(",");
                        container.appendChild(geminiBlog.createKernels(release_version));
                    }
                },
                error: function() {
                    utils.hide($('#KernelsBar'));
                    return false;
                }
            });
        }
    } else {
        utils.hide($('#KernelsBar'));
    }
};

geminiBlog.createKernels = function(entry) {
    var snippetViewHTML = utils.str2WrappedDOMElement(geminiBlog.RecentKernelsTemplate);
    var wrapper = $('.recent-kernels-wrapper', snippetViewHTML);
    $('.list-group-item', wrapper).textContent = entry[1] + ' ' + entry[2];
    return snippetViewHTML.childNodes[0];
};*/
