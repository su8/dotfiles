geminiBlog.themeModeTemplate = [
    "<div>",
        "<label>Welcome to the theme switcher &hearts; by bootswatch</label>",
        "<div class='row'>",
            "<div class='radio col-xs-10'>",
                "<label>",
                    "<input id='theme1' checked='' type='radio' name='optionsRadios'>",
                    "Cyborg [default]",
                "</label>",
            "</div>",
        "</div>",
        "<div class='row'>",
            "<div class='radio col-xs-10'>",
                "<label>",
                    "<input id='theme2' type='radio' name='optionsRadios'>",
                    "Paper [mimic Google Material Design]",
                "</label>",
            "</div>",
        "</div>",
        "<div class='row'>",
            "<div class='radio col-xs-10'>",
                "<label>",
                    "<input id='theme3' type='radio' name='optionsRadios'>",
                    "Sandstone [Weird and beautiful]",
                "</label>",
            "</div>",
        "</div>",
        "<div class='row'>",
            "<div class='radio col-xs-10'>",
                "<label>",
                    "<input id='theme4' type='radio' name='optionsRadios'>",
                    "Slate [A blast from the past]",
                "</label>",
            "</div>",
        "</div>",
    "</div>",
].join('');

geminiBlog.hackerThemeMode = function() {
    scroll(0,0);
    document.title = "Hack Theme";
    var container = utils.clearElements($("#entries-wrapper"));
    var snippetViewHTML = utils.str2WrappedDOMElement(geminiBlog.themeModeTemplate);
    container.appendChild(snippetViewHTML.childNodes[0]);

    var themesArr = ['theme1', 'theme2', 'theme3', 'theme4'];

    themesArr.forEach(function(theme) {
        utils.elemId(theme).addEventListener('click', function() {
            utils.elemId('currentTheme').href = './css/bootstrap-' + theme + '.min.css';
            localStorage.setItem('geminiTheme', theme);
        }, false);
    });

    if (localStorage.getItem('geminiTheme')) {
        utils.elemId(localStorage.getItem('geminiTheme')).checked = true;
    }

    geminiBlog.showRecentPosts();
    activeHackerChoice(2, false);
};
