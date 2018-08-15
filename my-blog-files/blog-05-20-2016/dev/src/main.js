! function(w) {
    "use strict";
    // !-- -------------------------------------------------------- -->
    // !-- Utilities												-->
    // !-- -------------------------------------------------------- -->
    // implementing $ with queryselector(+all)
    var $ = function(selector, rootNode) {
        return (rootNode || document).querySelector(selector);
    };
    /*var $$ = function(selector, rootNode) {
        return Array.prototype.slice.call((rootNode || document).querySelectorAll(selector));
    };*/
    var styleContainer = function(container, class1, class2) {
        var classes = container.className.split(' ');
        [class1, class2].forEach(function(curClazz) {
            if (classes.indexOf(curClazz) !== -1)
                classes.splice(classes.indexOf(curClazz), 1);
        });
        container.className = classes.join(' ') + ' ' + class2;
    };
    var utils = {
        escapeRegExp: function(string) { // escape regex
            return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
        },
        capFirst: function(text) { // capitalize first char, lower the rest
            return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
        },
        clearElements: function(container) {
            while (container.firstChild) {
                container.removeChild(container.firstChild);
            }
            return container;
        },
        hideElement: function(container) {
            container.style.opacity = "0";
        },
        showElement: function(container) {
            container.style.opacity = "1";
        },
        show: function(container) {
            styleContainer(container, 'hide', 'show');
        },
        hide: function(container) {
            styleContainer(container, 'show', 'hide');
        },
        // register custom events
        registerEvent: function(event, bubbles, cancelable) {
            return (CustomEvent) ? new CustomEvent(event, {
                bubbles: bubbles,
                cancelable: cancelable
            }) : (document.createEvent('Event').initEvent(event, bubbles, cancelable));
        },
        // custom listeners
        registerListener: function(target, type, callback) {
            (target.addEventListener || target.attachEvent)
                (target.addEventListener ? type: 'on' + type, callback);
        },
        removeListener: function(target, type, callback) {
            (target.removeEventListener || target.detachEvent)
                (target.removeEventListener ? type: 'on' + type, callback);
        },
        // template string to dom element , remember to return el.childNodes[0] // or use element accordingly;
        str2WrappedDOMElement: function(html) {
            var el = document.createElement('div');
            el.innerHTML = html;
            // return el.childNodes[0];
            return el;
        },
        elemId: function(id) {
            return document.getElementById(id);
        },
        // minimal ajax // use this.<attr> in callbacks to access the xhr object directly
        ajax: function(o) {
            o.useAsync = o.useAsync || true;
            if (!o.method || ! o.url || ! o.success) return false;
            var xhr = w.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
            xhr.timeout = geminiBlog.timeout || 4000;
            // throws syntax error otherwise
            if (o.mimeType) {
                xhr.overrideMimeType(o.mimeType);
            }
            xhr.ontimeout = function() {
                console.error("Request timed out: " + o.url);
            };
            xhr.onerror = o.error ? o.error: function() {
                console.log(xhr);
            };
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    o.success ? o.success(xhr) : (function() {
                        console.log(xhr);
                    })();
                }
            };
            xhr.open(o.method, o.url, o.useAsync);
            xhr.send(null);
        },
    };
    // !-- -------------------------------------------------------- -->
    // !-- Variables												-->
    // !-- -------------------------------------------------------- -->
    // global var
    var geminiBlog = {
        blogTitle       : "Blog",       // main page title
        archiveTitle    : "Archive",    // archive page title
        searchTitle     : "Search",     // search page title
        categoriesTitle : "Categories",  // categories page title
        author			: "John Doe",   // post author
        entries			: [],			// holds meta of all entries
        frontPosts		: 7,			// how many entries to show in snippets
        recentPosts     : 7,            // how many recent posts to show
        showRecentBar   : true,         // Show/hide the recent posts sidebar
        showCategories  : true,         // Show/hide the categories sidebar
        CategoriesEmpty : true,         // don't touch <----------!
        kernelsFirstLoad: true,         // boolean to send only one "GET"
        showKernelsBar  : true,         // Show/hide the kernels sidebar
        hackButton      : false,
        tags            : [],           // da tags list
        templates		: [],			// for all templates
        variables		: [],			// for all variables in posts
        variablePrefix	: '{|',			// {|this|} is a variable
        variablePostfix : '|}',
        snippetLength	: 170,			// how many characters to show per entry snippet?
        prevnextLinks   : true,          // previous and next blog post button links at the bottom of each post
        repoBase		: "./markdown/", // all entries beginning with ./  are prepended this url
        useAsync		: true,			// whether to use synchronous HTTP requests (bad idea)
        timeout			: 10000,			// request timeout
        markDownloads	: false,		// whether markdown files can be downloaded by the viewers
        textFile        : null,
        apiURL          : 'https://api.github.com/repos/wifiextender/wifiextender.github.io/contents/',
        activeMenuChoice: null,
    };
    // !-- -------------------------------------------------------- -->
    // !-- Functions												-->
    // !-- -------------------------------------------------------- -->
    geminiBlog.registerEntry = function(entryUrl, title, pubDate, tags, author) {
        // register the .md file as an entry and add it to geminiBlog.entries
        var pd = new Date(pubDate) || null;
        title = title || entryUrl;
        var re = new RegExp('[^A-Za-z0-9_ -]', 'g');
        var id = title.replace('.md', '').replace(re, '')
            .replace(/\s+/g, '-').toLowerCase();
        // if url begins with ./ replace it with repoBase, else leave as is and consider as full url
        var eurl = (entryUrl.slice(0, 2) === "./") ?
            geminiBlog.repoBase + entryUrl.slice(2) : entryUrl;
        var tags_clean = tags.toLowerCase().replace(" ", "").split(",");
        var tags_num = tags_clean.length;

        // create the entry object
        var entry = { // properties of each entry
            index: geminiBlog.entries.length,
            id: id,
            url: eurl,
            title: title,
            pubDate: pd,
            tags: tags_clean,
            author: author,
        };

        geminiBlog.entries.push(entry);

        if (tags && tags !== "") {
            geminiBlog.CategoriesEmpty = false;
            while (tags_num--)
                if (geminiBlog.tags.indexOf(
                            tags_clean[tags_num]) == - 1) {
                    geminiBlog.tags.push(tags_clean[tags_num]);
                }
        }
    };
    // sort list by a key - default: pubDate
    geminiBlog.sortEntries = function(key, elist, reverse) {
        key = key || "pubDate";
        elist = elist || geminiBlog.entries;
        reverse = reverse || true; // most recent first // highest value first
        elist.sort(function(a, b) {
            var keyA = a[key];
            var keyB = b[key];
            if (reverse) {
                return ((keyA < keyB) ? 1: ((keyA > keyB) ? - 1: 0));
            }
            else {
                return ((keyA < keyB) ? - 1: ((keyA > keyB) ? 1: 0));
            }
        });
    };
    // find entries by their id/index/tag
    geminiBlog.getEntryBy = function(itsTag, keyword, eid) {
        var i;
        if (geminiBlog.entries.length === 0) {
            return false;
        }
        if (geminiBlog.entries.length === 1) {
            return geminiBlog.entries[0];
        }

        if (!itsTag) {
            for (i in geminiBlog.entries) {
                // alert(geminiBlog.entries[i].id + " " + eid);
                if (geminiBlog.entries[i][keyword] === eid) {
                    return geminiBlog.entries[i];
                }
            }
            // alert(geminiBlog.entries[i].id+" "+eid);
            return false;
        }
        var tagged_entries = [];

        for (i in geminiBlog.entries) {
            var entry = geminiBlog.entries[i];
            if (entry.tags.indexOf(keyword) !== - 1) {
                tagged_entries.push(entry);
            }
        }
        return (tagged_entries.length > 0) ? tagged_entries: false;
    };
    // markdown to html conversion function with variable replacement
    /* markdown2html parser https://github.com/chjj/marked/ */
    if (w.marked) {
        geminiBlog.markDownOptions = {
            renderer: new marked.Renderer(),
            gfm: true,
            tables: true,
            breaks: false,
            pedantic: false,
            sanitize: true,
            smartLists: true,
            smartypants: false,
            //langPrefix: 'hljs ',
            highlight: function(code, lang) {
                return hljs.highlightAuto(code, [lang]).value;
            }
        };
        // this function makes html from markdown
        geminiBlog.mdToHTML = function(md) {
            var regularTable = new RegExp('<table>', 'g');
            if (marked && geminiBlog.markDownOptions) {
                return marked(geminiBlog.handleVars(md),
                        geminiBlog.markDownOptions)
                    .replace(regularTable, '<table class="table table-hover">');
            }
            return false;
        };
    }
    // parse and replace variables in entry
    geminiBlog.handleVars = function(markd, vname, vvalue) {
        // read vprefix and vpostfix from config
        // just replace if variable and value provided
        vname = vname || "";
        vvalue = vvalue || null;
        var x = geminiBlog.variables.length;
        // if name and value provided, do just that
        if (vname !== "" && vvalue !== null) {
            return markd.replace(new RegExp(utils.escapeRegExp(
                            geminiBlog.variablePrefix + vname +
                            geminiBlog.variablePostfix), 'g'), vvalue);
        } else {
            // else try defined variables
            while (x--) {
                vname = geminiBlog.variables[x].name;
                vvalue = geminiBlog.variables[x].value;
                markd = markd.replace(new RegExp(utils.escapeRegExp(
                                geminiBlog.variablePrefix + vname +
                                geminiBlog.variablePostfix), 'g'), vvalue);
            }
        }
        return markd;
    };



    geminiBlog.router = function() {
        // if anchored - show entry maching id with anchor or tag matching anchor or default page
        var anchor = document.location.hash.substring(2).toLowerCase(); // substring(2) removing hashbang

        // remove the highlighting effect
        if (geminiBlog.activeMenuChoice) {
            geminiBlog.activeMenuChoice.setAttribute('class',
                'list-group-item');
            geminiBlog.activeMenuChoice = null;
        }

        if (anchor !== "") {

            // routing done here based on hashbang anchors
            switch (true) {
                case anchor === "frontpage" : return geminiBlog.snippetView();
                case anchor === "archive"   : return geminiBlog.archiveView(false, false, false);
                case anchor === "search"    : return geminiBlog.searchOrLogView(true);
                case anchor === "new"       : return geminiBlog.searchOrLogView(false) ||
                                                geminiBlog.hackerMode("", true);

                case anchor === "edi"       : return geminiBlog.searchOrLogView(false) ||
                                                geminiBlog.archiveView(false, "Why so serious", true);

                case anchor === "settings"  : return geminiBlog.searchOrLogView(false) ||
                                                geminiBlog.settingsMode();

                case anchor === "theme"     : return geminiBlog.searchOrLogView(false) ||
                                                geminiBlog.hackerThemeMode();

                // parse posts by regex
                case(/^post=(.*)/.test(anchor)):
                    if (geminiBlog.getEntryBy(false, 'id', anchor.match(/^post=(.*)/)[1])) {
                        return geminiBlog.detailsView(geminiBlog.getEntryBy(false,
                                    'id', anchor.match(/^post=(.*)/)[1]));
                } else {
                    document.location.href = "#!frontpage";
                }
                break;

                // parse tags by regex
                case (/^tag=(.*)/.test(anchor)):
                    if (anchor.match(/^tag=(.*)/)[1]) {
                        return geminiBlog.archiveView(geminiBlog.getEntryBy(true,
                                    anchor.match(/^tag=(.*)/)[1]), geminiBlog.categoriesTitle, false);
                } else {
                    document.location.href = "#!frontpage";
                }
                break;

                case (/^edit=(.*)/.test(anchor)):
                    if (anchor.match(/^edit=(.*)/)[1]) {
                        return geminiBlog.searchOrLogView(false) ||
                            geminiBlog.hackerMode(anchor.match(/^edit=(.*)/)[1], false);
                } else {
                    document.location.href = "#!frontpage";
                }
                break;

                default:
                    document.location.href = "#!frontpage";
                break;
            }
        }

        // default - snippetview of fresh entries
        return geminiBlog.snippetView();
    };

    // setup = these functions are run after the page finishes loading
    geminiBlog.init = function() {
        // sort the lists
        geminiBlog.sortEntries("pubDate", geminiBlog.entries, false);
        geminiBlog.tags.sort();

        // populate sidebar with a list of entries - comment this out if sidebar is hidden
        // listView();
        // show view accordingly by router
        geminiBlog.router();
        utils.registerListener(w, 'hashchange', geminiBlog.router);
    };

    // !-- -------------------------------------------------------- -->
    // !-- Start the event listeners								-->
    // !-- -------------------------------------------------------- -->
    // fire geminiBlog.init() after page load or if the anchor changes
    utils.registerListener(w, 'load', geminiBlog.init);



    // debug
    w.geminiBlog = geminiBlog;

} (window);
