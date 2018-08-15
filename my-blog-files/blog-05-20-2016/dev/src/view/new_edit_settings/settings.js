geminiBlog.settingsMode = function() {
    scroll(0, 0);
    document.title = "Hack Settings";
    var container = utils.clearElements($("#entries-wrapper"));
    var snippetViewHTML = utils.str2WrappedDOMElement(geminiBlog.settingsModeTemplate);
    container.appendChild(snippetViewHTML.childNodes[0]);
    var udm = configDump(); // updated dump

    for (var name in udm.site)
    {
        switch(name) {
            case "showRecentBar":
            case "showCategories":
            case "prevnextLinks":
            case "markDownloads":
                utils.elemId(name).checked = udm.site[name]; // checkbox state
                break;
            default:
                if (name !== "variables")
                    utils.elemId(name).value = udm.site[name];
        }
    }
    makeGitClick();
    removePrevHandlers();

    funcHandler.prev = function() {
        updateGitFile(geminiBlog.apiURL + 'js/config.js', false, '', true);
    };

    utils.elemId('to-github-btn').addEventListener('click', funcHandler.prev, false);

    configLocalStorageBtnListeners(true);
    activeHackerChoice(3, false);
};
