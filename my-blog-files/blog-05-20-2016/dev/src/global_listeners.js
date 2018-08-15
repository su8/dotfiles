// Bootstrap dropdown menu without jquery
var daMenus = {

    // Navbar and dropdowns
    toggle: document.getElementsByClassName('navbar-toggle')[0],
    collapse: document.getElementsByClassName('navbar-collapse')[0],

    toggleMenu: function() { // Toggle if navbar menu is open or closed
        daMenus.collapse.classList.toggle('collapse');
    },

    // Close dropdowns when screen becomes big enough to switch to open by hover
    closeMenusOnResize: function() {
        if (document.body.clientWidth >= 768) {
            daMenus.collapse.classList.add('collapse');
        }
    },
};

var variousListeners = {
    'initHackerMode': ['click', geminiBlog.hackerMenu], // hacker mode button
    'submitfutton': ['click', geminiBlog.submitIt], // search form button
    'signinButton': ['click', geminiBlog.uzerBruteForce], // sign-in button
    'uzer-infut': ['input', geminiBlog.submitIt], // search form
    'GitModal-close-1': ['click', geminiBlog.closeGit],
    'GitModal-close-2': ['click', geminiBlog.closeGit],

    // github modal function to call upon 'enter' key
    'inputFieldPassword': ['keypress', function(evt) {
        geminiBlog.enterKeyFunc = geminiBlog.currentGitEnterKeyListener;
        geminiBlog.processEnterPress(evt);
    }],

    // signinButton 'enter' pressed
    'inputPassword': ['keypress', function(evt) {
        geminiBlog.enterKeyFunc = geminiBlog.uzerBruteForce;
        geminiBlog.processEnterPress(evt);
    }],
};

for (var x in variousListeners)
    utils.elemId(x).addEventListener(variousListeners[x][0],
            variousListeners[x][1], false);

// log out from the "Hacker Mode"
utils.elemId('logOut').addEventListener('click', function() {
    localStorage.setItem('uzerHackedIn', '');
    geminiBlog.hackButton = false;
    utils.hide($('#hackerMode'));
    document.location.href = "#!FlushTheWC";
}, false);

// dropdown menu listeners
utils.registerListener(w, 'resize', daMenus.closeMenusOnResize);
daMenus.toggle.addEventListener('click', daMenus.toggleMenu, false);
