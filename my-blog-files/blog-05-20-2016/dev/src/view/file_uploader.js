funcHandler.submitFile = function() {
    filesToGit('', '', '', true, geminiBlog.fileEntries);
};

var readFile = function() {
    geminiBlog.fileEntries = [];
    var input = utils.elemId('show-file-browzer').files;
    var num = input.length;

    var processFile = function(content, num) {
        var readIt = new FileReader();
        readIt.onload = function() {
            geminiBlog.fileEntries.push({
                'url': content.name,
                'file': readIt.result.split('base64,')[1]
            });
            if (num === 0)
                utils.elemId('trololo').click();
        };
        readIt.readAsDataURL(content);
    };

    while (num--)
        processFile(input[num], num);
};

makeGitClick('trololo'); // github modal

utils.elemId('browze-button').addEventListener('click', function() {
    utils.elemId('show-file-browzer').click();
}, false);

utils.elemId('show-file-browzer').addEventListener('change', readFile ,false);
