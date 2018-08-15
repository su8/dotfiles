var updateGitFile = function(url, notJSconfig, content, fromSettingsCall) {
    utils.ajax({
        method: 'GET',
        url: url,
        mimeType: 'application/json; charset=UTF-8',
        success: function(xhr) {
            filesToGit(notJSconfig ? content :
                    retJson(false, fromSettingsCall ? false : true),
                    url, JSON.parse(xhr.responseText).sha, false);
        }
    });
};

// https://developer.github.com/v3/repos/contents/
var filesToGit = function(givenFileContent, url,
        shaSum, alreadyBaseStr, filesArr) {
    var progressBar = utils.elemId('cur-progress');
    var setProgress = function(percent) {
        progressBar.setAttribute('style',
                'width:' + percent + '%');
    };

    var progressColour = function(colour) {
        progressBar.setAttribute('class',
                'progress-bar progress-bar-' + colour);
    };

    var hideOrShowIds = function(action) {
        [
            '#github-password-file-exists',
            '#to-github-btn',
            '#inputFieldPassword',
            '#github-ok-text'
        ].forEach(function(id) {
            action($(id));
        });
    };

    //utils.hide($('#github-password-file-exists'));
    var passField = utils.elemId('inputFieldPassword');
    var content = unescape(encodeURIComponent(
            filesArr ? filesArr[0].file : givenFileContent
    ));
    var bloB = {
            'content': alreadyBaseStr ? content : btoa(content),
            'message': 'blog',
            'branch': 'master',
            'encoding': 'base64'
    };

    if (shaSum)
        bloB.sha = shaSum;

    if (filesArr)
        url = geminiBlog.apiURL + 'img/' + filesArr[0].url;

    var xhr = w.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    xhr.timeout = geminiBlog.timeout;
    xhr.overrideMimeType('application/json; charset=UTF-8');
    xhr.onreadystatechange = function() {
        if (xhr.status == 401 || xhr.status == 422) {
            var resp = xhr.responseText;
            if (resp) {
                utils.elemId('oh-github-snap').innerHTML = 'Error ' +
                    xhr.status + ', ' + JSON.parse(resp).message;
            }
            hideOrShowIds(utils.show);
            utils.hide($('#github-ok-text'));
            progressColour('danger');
        }

        if (xhr.readyState == 4 &&
                (xhr.status == 201 || xhr.status == 200)) {
            hideOrShowIds(utils.hide);
            utils.show($('#github-ok-text'));
            if (filesArr) {
                filesArr.splice(0, 1);
                if (filesArr[0])
                    filesToGit('', '', '', true, filesArr);
            }
            progressColour('success');
        }
    };
    if (xhr.upload) {
        xhr.upload.onprogress = function(woof) {
            if (woof.lengthComputable) {
                setProgress((Math.floor((
                    woof.loaded / woof.total) * 100)));
            }
        };
        xhr.upload.onloadstart = function(meow) {
            setProgress(0);
            hideOrShowIds(utils.hide);
            progressColour('primary');
        };
        xhr.upload.onloadend = function(quack) {
            setProgress(100);
            utils.show($('#github-ok-text'));
        };
    }

    xhr.open('PUT', url, true);
    xhr.setRequestHeader('Authorization',
            'Basic ' + btoa('wifiextender:' + passField.value));
    xhr.send(JSON.stringify(bloB));
};

var retJson = function(toLocalStorage, newPost) {
    var name = '', daVal = '', udm = configDump();
    if (newPost) {
        var daDate = new Date();
        var inputfile = utils.elemId('inputFilename').value;
        udm.posts[geminiBlog.entries.length+
            daDate.getTime()] = ['./'+
              (inputfile ? inputfile
               : 'saved-'+geminiBlog.entries.length) + '.md',
            utils.elemId('inputTitle').value,
            utils.elemId('inputDate').value,
            utils.elemId('inputCategories').value,
            utils.elemId('inputAuthor').value || geminiBlog.author
        ];
    } else {
        for (name in udm.site)
            if (name !== "variables") {
                switch(name) {
                    case "showRecentBar":
                    case "showCategories":
                    case "prevnextLinks":
                    case "markDownloads":
                        daVal = utils.elemId(name).checked; // checkbox state
                        break;
                    case "frontPosts":
                    case "recentPosts":
                        daVal = parseInt(utils.elemId(name).value) || 6; // store as int
                        break;
                    default:
                        daVal = utils.elemId(name).value; // is it bool or str ?
                }
                switch(daVal) {
                    case "true":
                    case "false":
                        udm.site[name] = JSON.parse(daVal); // store as bool
                        break;
                    default:
                        udm.site[name] = daVal; // store as str
                }
            }
    }
    return toLocalStorage ? JSON.stringify(udm)
        : concatConfig(JSON.stringify(udm));
};

var makeTextFile = function (text) {
    var data = new Blob([text], {type: 'text/plain'});
    if (geminiBlog.textFile !== null) {
      window.URL.revokeObjectURL(geminiBlog.textFile);
    }
    geminiBlog.textFile = window.URL.createObjectURL(data);
    return geminiBlog.textFile;
};

var configDump = function() {
    return  JSON.parse(
              localStorage.getItem("geminidump") ||
              geminiBlog.inf);
};

var makeGitClick = function(Id) {
    funcHandler.gitmodal = function() {
        utils.show($('#GitModal'));
        if (!utils.elemId('inputFieldPassword').value)
            utils.show($('#inputFieldPassword'));
        else
            utils.hide($('#inputFieldPassword'));
        utils.elemId('cur-progress').setAttribute('style','width:0%');
        utils.show($('#to-github-btn'));
        var nasty = [funcHandler.prev, funcHandler.submitFile];

        geminiBlog.currentGitEnterKeyListener = Id ? nasty[1] : nasty[0];
        utils.elemId('to-github-btn').removeEventListener('click', nasty[Id ? 0 : 1], false);
        utils.elemId('to-github-btn').addEventListener('click', nasty[Id ? 1 : 0], false);

        utils.hide($('#github-ok-text'));
        utils.hide($('#github-password-file-exists'));
        //utils.elemId('inputFieldPassword').value = '';
    };

    utils.elemId(Id || 'git-modal').addEventListener('click',
            funcHandler.gitmodal, false);
};

var configLocalStorageBtnListeners = function(reqSettings) {
    var jsdownload_button = utils.elemId('jsdownload-button');
    jsdownload_button.addEventListener('click', function() {
        jsdownload_button.setAttribute('href',
            makeTextFile(retJson(false, reqSettings ? false : true)));
        localStorage.clear();
    }, false);

    var changeLocalStorageBtnColour = function(colour) {
        utils.elemId('localstorage-button').setAttribute('class',
                'btn btn-xs btn-' + colour);
    };

    utils.elemId('localstorage-button').addEventListener('click', function() {
        localStorage.setItem("geminidump",
                retJson(true, reqSettings ? false : true));
        changeLocalStorageBtnColour('success');
        setTimeout(function() {
            changeLocalStorageBtnColour('default');
        }, 500);
    }, false);
};

/* one button, 4 diff. listeners >> nightmare */
var funcHandler = {
    'gitmodal': function() {},
    'prev': function() {},
    'submitFile': function() {},
};

/* stay cheesy no matter what */
var removePrevHandlers = function() {
    for (var func in funcHandler) {
        utils.elemId('to-github-btn').removeEventListener('click', funcHandler[func], false);
    }
};

var concatConfig = function(stringified) {
    return [
        "(function() {",
            "'use strict';",
            "var name,x,site,posts,infect;",
            "infect = " + stringified + ";",
            "site = infect.site;",
            "posts = infect.posts;",
            "for (name in site)",
                "geminiBlog[name] = site[name];",
            "for (x in posts)",
                "geminiBlog.registerEntry(posts[x][0], posts[x][1],",
                "posts[x][2], posts[x][3], posts[x][4]);",
            "geminiBlog.inf = JSON.stringify(infect);",
        "})();"
    ].join('');
};

var activeHackerChoice = function(selection, skipHighlighting) {
    var hackerID = utils.elemId('hackerMode').getElementsByClassName('list-group-item');
    var num = hackerID.length;
    while (num--)
        hackerID[num].setAttribute('class',
                'list-group-item');
    if (!skipHighlighting) {
        hackerID[selection].setAttribute('class',
                'active list-group-item');
        geminiBlog.activeMenuChoice = hackerID[selection];
    }
};
