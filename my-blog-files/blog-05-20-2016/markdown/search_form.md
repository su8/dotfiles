
---

Everyone is going to tell you that you can't have search form in your static website, unless you use external **something** in order to process the search form queries. Guess what, Javascript is here to prove 'em wrong.

Here I'll present you dead simple and interactive search form that YOU can integrate so easily in **any** static page.

Try the demo first - {|img|}/search_form/index.html . Once you start typing you'll see the results immediately, no need to press "submit" or "search" buttons.

I'll split the javascript and html in separate files.

index.html

```html

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
    <title>Zearch</title>

    <!-- Bootstrap -->
    <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" rel="stylesheet">

    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
      <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->
  </head>
  <body>

    <div class="container">
      <div id="content">
        <div class="row">
          <div class="page-content col-md-6 col-sm-8">

            <h1>Type L</h1>
            <form>
              <div class="input-group custom-search-form">
                <input type="text" id="uzer-infut" class="form-control" placeholder="Ask me anything">
              </div>
            </form>


            <div id="queryMe"></div>


          </div><!--/.page-content-->
        </div><!--/.row-->
      </div><!--/.content-->
    </div><!--/.container-->

  <script defer src="search.js"></script>

  </body>
</html>

```

**search.js**

```javascript

(function() {
    'use strict';

    var $ = function(selector, rootNode) {
        return (rootNode || document).querySelector(selector);
    };

    var utils = {
        clearElements: function(container) {
            while (container.firstChild) {
                container.removeChild(container.firstChild);
            }
            return container;
        },
        str2WrappedDOMElement: function(html) {
            var el = document.createElement('div');
            el.innerHTML = html;
            return el;
        },
    };

    var nothingFoundTemplate = [
        "<div class='oh-search-snap'>",
            "<hr>",
                "<div class='alert alert-info'>Nothing found.</div>",
            "<hr>",
        "</div>"
    ].join('');

    var searchTemplate = [
        "<div class='page-header'>",
            "<h4 class='post-title'>",
                "<a class='post-title-url text-muted'></a>",
            "</h4>",
        "</div>"
    ].join('');


    var entries = {
        //  title     url
            'Lorem': 'http://example.com',
            'Little Joe': 'http://example.com',
            'ipsum': 'http://example.com',
            'next': 'http://example.com',
            'generation': 'http://example.com',
            'old': 'http://example.com',
            'school': 'http://example.com'
    };

    var appendEntry = function(postName) {
        var searchViewHTML = utils.str2WrappedDOMElement(searchTemplate);
        var wrapper = $('.page-header', searchViewHTML);

        $('.post-title-url', wrapper).setAttribute("href", entries[postName]);
        $('.post-title-url', wrapper).textContent = (postName.length > 35) ? postName.slice(0, 35) + "...": postName;

        return searchViewHTML.childNodes[0];
    };

    var invokeSearch = function() {
        var container = utils.clearElements($("#queryMe"));
        var userQuery = document.getElementById("uzer-infut").value.toLowerCase();
        var foundPosts = false;
        var post = "";

        if (userQuery !== "") {
            for (post in entries) {
                if (post.toLowerCase().match(userQuery)) {
                    container.appendChild(appendEntry(post));
                    foundPosts = true;
                }
            }
        } else {
            utils.clearElements($("#queryMe"));
        }

        if (!foundPosts && userQuery !== "") {
            var nothingFound = utils.str2WrappedDOMElement(nothingFoundTemplate);
            container.appendChild(nothingFound.childNodes[0]);
        }
    };

    var submitIt = function() {

        // Go to search.html page

        var curerntLocation = window.location.pathname;

        if (currentLocation === "/search.html") {
            invokeSearch();
        } else {
            document.location.href = "/search.html";
            invokeSearch();
        }
    };

    document.getElementById('uzer-infut').addEventListener('input', invokeSearch, false);

})();

```

## Hint

Store the entire `search.js` script as single line string in your static blog/page/website generator, and have the entries generated on-the-fly and concatenate to the script that is stored as string.

Something like

```bash

x = "script head" + ENTRIES +  "script bottom"

# open 'search.js' for writing and add the new content

```

