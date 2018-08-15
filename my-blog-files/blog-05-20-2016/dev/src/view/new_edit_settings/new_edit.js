geminiBlog.hackerMode = function(entry, newPost) {
    scroll(0,0); // scroll to top, useful when on mobile device
    var
        container    = utils.clearElements($("#entries-wrapper")),
        name         = '',
        mdURL        = geminiBlog.apiURL + 'markdown/',
        filename     = '',
        snippetViewHTML = '',
        download_btn = null,
        configJsURL  = geminiBlog.apiURL + 'js/config.js';

    if (!newPost) {
        document.title = "Hack Edit";
        snippetViewHTML = utils.str2WrappedDOMElement(geminiBlog.editTemplate);
        $('#download-button', snippetViewHTML).setAttribute('download',
                entry.replace(geminiBlog.repoBase, ''));
        container.appendChild(snippetViewHTML.childNodes[0]);
        download_btn = utils.elemId('download-button');
        download_btn.setAttribute('download', entry.slice(11));

        utils.ajax({
            method: "GET",
            url: entry,
            mimeType: "text/plain; charset=x-user-defined",
            success: function(xhr) {
                utils.elemId('text-body').value = xhr.responseText;
            },
            error: function() {
                console.log("err");
                return false;
            }
        });
        activeHackerChoice(1, false);

    } else {
        document.title = "Hack New Post";
        snippetViewHTML = utils.str2WrappedDOMElement(geminiBlog.newPostTemplate);
        container.appendChild(snippetViewHTML.childNodes[0]);
        var inputFilename = utils.elemId('inputFilename');
        var moreSettingsBool = true;
        download_btn = utils.elemId('download-button');

        utils.elemId('text-body').value = "\n---\n\nHello World";

        inputFilename.addEventListener('input', function() {
            var udm = configDump(); // updated dump
            filename = inputFilename.value + '.md';
            download_btn.setAttribute('download', filename);

            if (localStorage.getItem(filename)) {
                utils.elemId('text-body').value = localStorage.getItem(filename);
            }

            var filenameMD = './' + filename;
            var filenameExists = false;
            for (name in udm.posts) {
                if (filenameMD === udm.posts[name][0]) {
                    filenameExists = true;
                    utils.show($('#filenameExists'));
                    utils.hide($('#entire-blk'));
                    break;
                }
            }

            if (!filenameExists) {
                utils.hide($('#filenameExists'));
                utils.show($('#entire-blk'));
            }
        }, false);
        download_btn.addEventListener('click', function() {
            if (!inputFilename.value) {
                filename = 'saved-' + geminiBlog.entries.length + '.md';
                download_btn.setAttribute('download', filename);
            }
        }, false);
        activeHackerChoice(0, false);
    }

    makeGitClick();
    removePrevHandlers();

    var
        text_body = utils.elemId('text-body'),
        rendertxt = true;

    funcHandler.prev = function() {
        if (!newPost) {
            updateGitFile(mdURL + entry.slice(11),
                    true, text_body.value, false);
        } else {
            filesToGit(text_body.value, mdURL + filename, '', false);
            updateGitFile(configJsURL, false, '', false);
        }
    };

    utils.elemId('to-github-btn').addEventListener('click', funcHandler.prev, false);

    utils.elemId('render-button').addEventListener('click', function() {
        if (rendertxt) {
            utils.hide($('#render-txt'));
            utils.elemId('render-html').innerHTML =
                geminiBlog.mdToHTML(text_body.value);
            utils.show($('#render-html'));
            rendertxt = false;
        } else {
            utils.hide($('#render-html'));
            utils.show($('#render-txt'));
            rendertxt = true;
        }
    } , false);

    utils.elemId('text-body').addEventListener('input', function () {
        if (newPost) {
            localStorage.setItem(
                (inputFilename.value ? inputFilename.value :
                 'saved-'+geminiBlog.entries.length) +
                '.md', text_body.value);
        }
        download_btn.setAttribute('href', makeTextFile(text_body.value));
    }, false);

    if (newPost) {
        configLocalStorageBtnListeners(false);
        var d = new Date();
        var mths = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];

        var theDateNow = mths[d.getMonth()] + ' ' + d.getDate() + ', ' +
            d.getFullYear();

        utils.elemId('inputDate').value = theDateNow;
        utils.elemId('more-settings-btn').addEventListener('click', function() {
            if (moreSettingsBool) {
                utils.show($('#more-settings-blk'));
                moreSettingsBool = false;
            } else {
                utils.hide($('#more-settings-blk'));
                moreSettingsBool = true;
            }
        }, false);
    }

    geminiBlog.showRecentPosts();
};
