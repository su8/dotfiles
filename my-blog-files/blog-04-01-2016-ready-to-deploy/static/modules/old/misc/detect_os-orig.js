var Detection = 
{
    mobile:  ["Android", "iPhone", "iPod", "iPad", "Symbian"],

    shorter: ["Linux", "Free", "Open", "NetBSD", "BSD", "Mac",
              "Win", "Sun", "HP", "Play", "Web", "QNX", "BeOS", "X11", "OS/2"],

    longer:  ["Linux", "FreeBSD", "OpenBSD", "NetBSD", "BSD", "Macintosh",
              "Windows", "SunOS", "Hewlett-Packard", "PlayStation", 
              "WebTV OS", "QNX", "BeOS", "UNIX", "OS/2"],

    found: "unknown",

    findOS: function(arr, os, mobile_bool)
    {
        var x;

        for (x = 0; x < arr.length; x++)
            if (os.indexOf(arr[x]) != -1)
            {
                this.found = (mobile_bool ? arr[x] : this.longer[x]);
                break;
            }
    },

    init: function()
    {
        var itsmobile = navigator.userAgent.match(/(Android)|(iPhone)|(iPod)|(iPad)|(Symbian)/i);

        if (itsmobile)
            this.findOS(this.mobile, navigator.userAgent, true);
        else
            this.findOS(this.shorter, navigator.platform, false);
    }
};


function showOS()
{
    Detection.init();

    alert("Your OS is: " + Detection.found);
}