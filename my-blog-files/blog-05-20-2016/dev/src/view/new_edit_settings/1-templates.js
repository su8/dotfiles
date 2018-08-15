geminiBlog.editTemplate = [
    "<div id='edit-template'>",
        "<button class='btn btn-info btn-xs' id='render-button'>",
            "<span>&#x021C4; Preview</span>",
        "</button>",
        "<div id='render-txt'>",
            "<div class='form-group'>",
                "<label for='text-body'></label>",
                "<textarea class='form-control' rows='20' id='text-body'></textarea>",
            "</div>",
        "</div>",
        "<div id='render-html'></div>",
        "<hr>",
        "<p class='text-muted'>",
            "GitHub was also [recently] integrated to make the file submission really simple.",
        "</p>",
        "<hr>",
        "<a class='btn btn-default btn-xs' id='download-button'>",
            "<span>&#x2193; Download</span>",
        "</a>",
        "<button id='git-modal' type='button' class='btn btn-primary btn-xs pull-right' data-toggle='modal'>To GitHub</button>",
    "</div>",
].join('');

geminiBlog.newPostTemplate = [
    "<div id='edit-template'>",
        "<div class='form-group has-error'>",
            "<span id='filenameExists' class='hide help-block'>The given filename exists.</span>",
            "<input class='form-control' id='inputFilename' type='text' placeholder='Filename: hello_world'>",
        "</div>",
        "<div id='entire-blk'>",
            "<div class='form-group has-warning'>",
                "<input class='form-control' id='inputTitle' type='text' placeholder='Title: Some short description'>",
            "</div>",
            "<div id='more-settings-blk' class='hide'>",
                "<div class='form-group has-success'>",
                    "<input class='form-control' id='inputCategories' type='text' placeholder='Categories: this,and,that'>",
                "</div>",
                "<div class='form-group'>",
                    "<input class='form-control' id='inputDate' type='text' placeholder='Date:'>",
                    "<span class='help-block text-primary'>",
                        "The date was added automatically.",
                    "</span>",
                "</div>",
                "<div class='form-group'>",
                    "<input class='form-control' id='inputAuthor' type='text' placeholder='Author:'>",
                    "<span class='help-block text-info'>",
                        "You must add Author's name.",
                    "</span>",
                "</div>",
            "</div>",
            "<button class='btn btn-info btn-xs' id='render-button' type='button'>",
                "<span>&#x021C4; Preview</span>",
            "</button>",
            "<button id='more-settings-btn' class='btn btn-success btn-xs pull-right' type='button'>",
                "<span>&#x2637; More Settings</span>",
            "</button>",
            "<div id='render-txt'>",
                "<div class='form-group'>",
                    "<label for='text-body'></label>",
                    "<textarea class='form-control' rows='20' id='text-body'></textarea>",
                "</div>",
            "</div>",
            "<div id='render-html'></div>",
            "<hr>",
            "<p class='text-muted'>",
                "If you plan to write many posts, and/or edit the Settings, please click ",
                "<span class='text-warning'>Save to localstorage</span>",
                ". Later on, when you are done, please download <span class='text-success'>config.js</span>",
                " This way you avoid multiple config.js downloads.",
            "</p>",
            "<p class='text-muted'>",
                "GitHub was also [recently] integrated to make the file submission really simple. By pressing Submit to GitHub you'll complete Step 1 and Step 2 with one click.",
            "</p>",
            "<hr>",
            "<label for='download-button'>1.</label>",
            " <a class='btn btn-default btn-xs' id='download-button' download='filename'>",
                "<span>&#x2193; Download</span>",
            "</a>",
            " <span class='text-info'>&rarr;</span>",
            " <label for='download-button'>2.</label>",
            " <a class='btn btn-default btn-xs' id='jsdownload-button' download='config.js'>",
                "<span>&#x2193; config.js</span>",
            "</a>",
            " <span class='text-info'>or</span>",
            " <label for='download-button'>2.</label>",
            " <a class='btn btn-default btn-xs' id='localstorage-button'>",
                "<span>&#x267B; Save to localstorage</span>",
            "</a>",
            " <button id='git-modal' type='button' class='btn btn-primary btn-xs' data-toggle='modal'>To GitHub</button>",
        "</div>",
    "</div>",
].join('');

geminiBlog.settingsModeTemplate = [
    "<form>",

        "<div class='row form-group has-warning'>",
            "<div class='col-xs-6'>",
                "<input class='form-control' id='blogTitle' type='text'>",
                "<span class='help-block'>Blog Title</span>",
            "</div>",

            "<div class='col-xs-6'>",
                "<input class='form-control' id='archiveTitle' type='text'>",
                "<span class='help-block'>Archive Title</span>",
            "</div>",
        "</div>",

        "<div class='row form-group has-warning'>",
            "<div class='col-xs-6'>",
                "<input class='form-control' id='searchTitle' type='text'>",
                "<span class='help-block'>Search Title</span>",
            "</div>",

            "<div class='col-xs-6'>",
                "<input class='form-control' id='categoriesTitle' type='text'>",
                "<span class='help-block'>Categories Title</span>",
            "</div>",
        "</div>",

        "<div class='row form-group has-warning'>",
            "<div class='col-xs-6'>",
                "<input class='form-control' id='frontPosts' type='text'>",
                "<span class='help-block'>Front page posts</span>",
            "</div>",

            "<div class='col-xs-6'>",
                "<input class='form-control' id='recentPosts' type='text'>",
                "<span class='help-block'>Recent posts</span>",
            "</div>",
        "</div>",
        "<hr>",

        "<div class='col-xs-6>'",
            "<div class='checkbox'>",
                "<label class='text-primary'>",
                    "<input id='showRecentBar' type='checkbox'> Show/hide Recent Posts sidebar",
                "</label>",
            "</div>",
        "</div>",

        "<div class='col-xs-6>'",
            "<div class='checkbox'>",
                "<label class='text-primary'>",
                    "<input id='showCategories' type='checkbox'> Show/hide Categories sidebar",
                "</label>",
            "</div>",
        "</div>",

        "<div class='col-xs-6>'",
            "<div class='checkbox'>",
                "<label class='text-primary'>",
                    "<input id='prevnextLinks' type='checkbox'> In-post Previous and Next page links",
                "</label>",
            "</div>",
        "</div>",

        "<div class='col-xs-6>'",
            "<div class='checkbox'>",
                "<label class='text-primary'>",
                    "<input id='markDownloads' type='checkbox'> Allow posts to be downloaded",
                "</label>",
            "</div>",
        "</div>",
        "<hr>",

        "<span class='text-muted'>",
            "If you also plan to write a post(s), please click ",
            "<span class='text-warning'>Save to localstorage</span>",
            ". Later on, when you are done, please download <span class='text-success'>config.js</span>",
            " This way you avoid multiple config.js downloads.",
        "</span>",
        "<hr>",
        "<p class='text-muted'>",
            "GitHub was also [recently] integrated to make the file submission really simple.",
        "</p>",
        "<hr>",

        " <a class='btn btn-default btn-xs' id='jsdownload-button' download='config.js'>",
            "<span>&#x2193; config.js</span>",
        "</a>",
        " <a class='btn btn-default btn-xs' id='localstorage-button'>",
            "<span>&#x267B; Save to localstorage</span>",
        "</a>",
        "<button id='git-modal' type='button' class='btn btn-primary btn-xs pull-right' data-toggle='modal'>To GitHub</button>",
    "</form>",
].join('');
