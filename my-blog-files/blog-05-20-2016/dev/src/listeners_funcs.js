// uzer-infut 'input' / submitfutton 'click'
geminiBlog.submitIt = function() {
    var anchor = document.location.hash.substring(2).toLowerCase();
    if (anchor === 'search')
        geminiBlog.searchOrLogView(true);
    else
        document.location.href = '#!search';
};

// signinButton 'click'
geminiBlog.uzerBruteForce = function() {
    var password = utils.elemId('inputPassword').value;
    var passMatch = password === 'admin';

    // fake log-in form, fake password
    if (passMatch) {
        utils.hide($('#loginForm'));
        utils.show($('#hackerMode'));
        localStorage.setItem('uzerHackedIn', 'yup');
        activeHackerChoice(0, '', true);
        document.location.href = '#!HoneyImBack';
    }

    utils.elemId('passwordError').setAttribute('class',
            'form-group' + (passMatch ? '' : ' has-error'));
    utils.elemId('signinButton').setAttribute('class',
            'btn btn-block btn-' + (passMatch ? 'primary' : 'danger'));
};

//  initHackerMode 'click'
geminiBlog.hackerMenu = function() {
    var menuList = utils.elemId('hackerMode')
        .className.indexOf('hide');

    if (localStorage.getItem('uzerHackedIn')) {
        utils.hide($('#loginForm'));
        if (menuList !== -1) {
            utils.show($('#hackerMode'));
        } else {
            utils.hide($('#hackerMode'));
        }
    } else if (!geminiBlog.hackButton) {
        utils.show($('#loginForm'));
        geminiBlog.hackButton = true;
    } else {
        utils.hide($('#loginForm'));
        geminiBlog.hackButton = false;
    }
};

// https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault
// call the assigned 'enter' key function
geminiBlog.processEnterPress = function(evt) {
    var keyCode = evt.keyCode;
    if (keyCode && keyCode === 13) {
        geminiBlog.enterKeyFunc();
        evt.preventDefault(); // don't submit anything
    }
};

// github modal 2 close buttons
geminiBlog.closeGit = function() {
    utils.hide($('#GitModal'));
};
