import os
import re
import shutil
try:
    from configparser import ConfigParser
    python = 3
except ImportError:
    from ConfigParser import ConfigParser
    python = str()

class WriteToFile:
    def __init__(self, filename, *args):
        _filen = filename
        _given_args = [x for x in args]
        _write_to = {
        '1': 'generated/index.html', '2': 'generated/archive.html',
        '3': 'generated/forum.html', '4': 'generated/search.html',
        '5': 'generated/rss.xml', '6': 'generated/tags/{}/index.html'.format(_given_args[0]),
        '7': ('generated/post/{0}/{1}/{2}/index.html'.format(_given_args[0], _given_args[1],
            _given_args[2]) if len(_given_args) > 2 else str()) 
        }
        if _filen == '6':
            del _given_args[0]
        if _filen == '7':
            for x in range(3):
                del _given_args[0]
        with open(_write_to[_filen], 'wt') as f:
            f.write(''.join(_given_args))

class ReadStaticFile:
    def __init__(self, filename):
        self._filename = filename
    def __repr__(self):
        with open(self._filename, "rt") as a:
            return a.read()

class Blogfy:

    def start_tags(self):
        tg = [x.lstrip(' ') for x in self.cfg.get('customizations', 'tags').split(',')]
        sec_dict = dict()
        for z in sorted(self.one_dict.values()):
            for x in tg:
                if re.findall(r'{}'.format(x), z[3]):
                    if not x in sec_dict:
                        sec_dict[x] = ['<span>{0}</span>&nbsp;<a href="{1}">{2}</a><br />'
                        .format(z[0], z[6], z[2])]
                    else:
                        sec_dict[x].append('<span>{0}</span>&nbsp;<a href="{1}">{2}</a><br />'
                            .format(z[0], z[6], z[2]))

        for x,z in sec_dict.items():
            font_plus_link = '<a style="font-size:{0}px" href="{1}tags/{2}/">[{2}]</a>&nbsp;'
            if len(z) < 5:
                self.tags_body += font_plus_link.format(
                    14, self.cfg.get('important', 'address'), x)
            elif 5 >= len(z) < 8:
                self.tags_body += font_plus_link.format(
                    18, self.cfg.get('important', 'address'), x)
            else:
                self.tags_body += font_plus_link.format(
                    30, self.cfg.get('important', 'address'), x)

        for x,z in sec_dict.items():
            tags_dir = 'generated/tags/{}/'.format(x)
            if not os.path.exists(tags_dir):
                os.makedirs(tags_dir)
            WriteToFile('6', x, self.hf_pagination, 'tag: {0}<br />{1}'.format(x, ''.join(reversed(z))),
                self.footer_i_two_tags.replace('<!-- tags_bar2 -->', self.tags_body)
                .replace("<!-- recent posts -->", self.recent_posts))

    def start_rss(self):
        rss_item = str()
        head = '''<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
    <channel>
        <title>{title}</title>
        <link>{address}</link>
        <description>{description}</description>'''.format(
            title=self.cfg.get('important', 'name'),
            address=self.cfg.get('important', 'address'),
            description=self.cfg.get('important', 'description'))
        for x,z in zip(sorted(self.one_dict.values(), reverse=True),
        	range(self.cfg.getint('customizations', 'number of posts on front page'))):
            rss_item += '''
                <item>
                    <title>{title2}</title>
                    <pubDate>{date2}</pubDate>
                    <link>{address2}</link>
                    <description>{description2}</description>
            </item>'''.format(title2=x[2], date2=x[0], address2=x[6], description2=x[5])
        WriteToFile('5', head, rss_item, '</channel></rss>')

    def start_pagination(self):
        page_number = 0
        while self.one_dict:
            posts_as_body = str()
            for x,z in zip(sorted(self.one_dict.values(), reverse=True),
                range(self.cfg.getint('customizations', 'number of posts on front page'))):
                posts_as_body += x[7]
                del self.one_dict[x[1]]
            page_number += 1

            pagination_dir = 'generated/page/{}/'.format(page_number)
            if not os.path.exists(pagination_dir):
                os.makedirs(pagination_dir)
            curr_header = self.hf_pagination
            footer_pagi = self.footer_i_two.replace('<!-- tags_bar2 -->', self.tags_body)\
            .replace("<!-- recent posts -->", self.recent_posts)
            address = self.cfg.get('important', 'address')
                
            with open(pagination_dir + 'index.html', 'wt') as bambam:
                if not page_number > 1:
                    bambam.write(curr_header + posts_as_body + footer_pagi.replace("<!-- pagination -->",
                        '<div class="page-navigation cf"><div class="nav-next">\
                        <a href="{newer}">Newer Entries</a>\
                        </div><div class="nav-previous"><a href="{older}">Older Entries</a></div></div>'
                        .format(newer=address, older=address + 'page/{}/'.format(page_number+1))))
                else:
                    bambam.write(curr_header + posts_as_body + footer_pagi.replace("<!-- pagination -->",
                        '<div class="page-navigation cf"><div class="nav-next">\
                        <a href="{newer}">Newer Entries</a></div>\
                        <div class="nav-previous"><a href="{older}">Older Entries</a></div></div>'
                        .format(newer=address + 'page/{}/'.format(page_number-1), 
                            older=address + 'page/{}/'.format(page_number+1))))

        with open(pagination_dir + "index.html", "rt") as infile, \
        open(pagination_dir + "index.html.bak", "wt") as outfile:
            replace_that_string = infile.read()\
            .replace('<div class="nav-previous"><a href="{older}">Older Entries</a></div>'
                .format(older=address + 'page/{}/'.format(page_number+1)), "")
            outfile.write(replace_that_string)
        shutil.move(pagination_dir + "index.html.bak", pagination_dir + "index.html")

    def __init__(self):
        self.cfg = ConfigParser()
        if python:
            self.cfg.read('config.ini')
        else:
            self.cfg.readfp(open('config.ini'))

        self.one_dict = dict()
        action_button = '"action-button"'
        posts = os.listdir("text posts/")

        template = self.cfg.get('customizations', 'template in use')

        header = format(ReadStaticFile("static/{}/header".format(template)))\
        .replace("site_description", self.cfg.get('important', 'description'))\
        .replace("titlefixed", self.cfg.get('important', 'name'))

        hf_post = format(ReadStaticFile("static/{}/header_post".format(template)))\
        .replace("site_description", self.cfg.get('important', 'description'))

        self.hf_pagination = format(ReadStaticFile("static/{}/header_pagination".format(template)))\
        .replace("site_description", self.cfg.get('important', 'description'))\
        .replace("titlefixed", self.cfg.get('important', 'name'))

        forum_header = format(ReadStaticFile("static/{}/header_forum".format(template)))\
        .replace("site_description", self.cfg.get('important', 'description'))\

        search_header = format(ReadStaticFile("static/{}/header_search".format(template)))\
        .replace("site_description", self.cfg.get('important', 'description'))\

        archive_header = format(ReadStaticFile("static/{}/header_archive".format(template)))\
        .replace("site_description", self.cfg.get('important', 'description'))\
        .replace("titlefixed", self.cfg.get('customizations', 'archive page title'))

        footer_p = format(ReadStaticFile("static/{}/footer_post".format(template)))\
        .replace("footer_text", self.cfg.get('customizations', 'footer text'))\
        .replace("blogfy_", self.cfg.get('social', 'disqus shortname'))

        footer_i = format(ReadStaticFile("static/{}/footer".format(template)))\
        .replace("footer_text", self.cfg.get('customizations', 'footer text'))

        self.footer_i_two = format(ReadStaticFile("static/{}/footer".format(template)))\
        .replace("footer_text", self.cfg.get('customizations', 'footer text'))

        if self.cfg.get('social', 'github account name'):
            github = '<script src="js/jquery.min.js" type="text/javascript"></script><script src="js/github.js" type="text/javascript"></script><script type="text/javascript">$(function() {$("#github-projects").loadRepositories("github_account_name");});</script>'
            github_post = '<script src="../../../../js/jquery.min.js" type="text/javascript"></script><script src="../../../../js/github.js" type="text/javascript"></script><script type="text/javascript">$(function() {$("#github-projects").loadRepositories("github_account_name");});</script>'
            github_sidebar = '<aside id="sidebar"><ul><li class="block"><div class="sidebar-top"></div><div class="sidebar-content"><h4 class="heading">GitHub Repos</h4><div id="github-projects"></div></div><div class="sidebar-bottom"></div></li></ul></aside>'
            footer_p = footer_p.replace("<!-- github -->", github_post).replace("<!-- github_sidebar -->", github_sidebar)\
            .replace("github_account_name", self.cfg.get('social', 'github account name'))
            footer_i = footer_i.replace("<!-- github -->", github).replace("<!-- github_sidebar -->", github_sidebar)\
            .replace("github_account_name", self.cfg.get('social', 'github account name'))

            github2 = '<script src="../../js/jquery.min.js" type="text/javascript"></script><script src="../../js/github.js" type="text/javascript"></script><script type="text/javascript">$(function() {$("#github-projects").loadRepositories("github_account_name");});</script>'
            github_post2 = '<script src="../../js/jquery.min.js" type="text/javascript"></script><script src="../../js/github.js" type="text/javascript"></script><script type="text/javascript">$(function() {$("#github-projects").loadRepositories("github_account_name");});</script>'
            github_sidebar2 = '<aside id="sidebar"><ul><li class="block"><div class="sidebar-top"></div><div class="sidebar-content"><h4 class="heading">GitHub Repos</h4><div id="github-projects"></div></div><div class="sidebar-bottom"></div></li></ul></aside>'
            self.footer_i_two = self.footer_i_two.replace("<!-- github -->", github2).replace("<!-- github_sidebar -->", github_sidebar2)\
            .replace("github_account_name", self.cfg.get('social', 'github account name'))

        if self.cfg.get('customizations', 'tags'):
            self.footer_i_two_tags = self.footer_i_two.replace('<!-- tags_bar -->', '<aside id="sidebar"><ul><li class="block"><div class="sidebar-top"></div><div class="sidebar-content"><h4 class="heading">Tags</h4><!-- tags_bar2 --></div><div class="sidebar-bottom"></div></li></ul></aside><div id="clear"></div>')
            self.footer_i_two = self.footer_i_two.replace('<!-- tags_bar -->', '<aside id="sidebar"><ul><li class="block"><div class="sidebar-top"></div><div class="sidebar-content"><h4 class="heading">Tags</h4><!-- tags_bar2 --></div><div class="sidebar-bottom"></div></li></ul></aside>')
            footer_i = footer_i.replace('<!-- tags_bar -->', '<aside id="sidebar"><ul><li class="block"><div class="sidebar-top"></div><div class="sidebar-content"><h4 class="heading">Tags</h4><!-- tags_bar2 --></div><div class="sidebar-bottom"></div></li></ul></aside>')
            footer_p = footer_p.replace('<!-- tags_bar -->', '<aside id="sidebar"><ul><li class="block"><div class="sidebar-top"></div><div class="sidebar-content"><h4 class="heading">Tags</h4><!-- tags_bar2 --></div><div class="sidebar-bottom"></div></li></ul></aside>')

        for post in posts:
            with open("text posts/" + post, 'rt') as f:
                f_cont = f.read().split('\n')
                title = f_cont[0][7:]
                date = f_cont[1][6:]
                post_body = '<h1>{0}</h1><br />{1}<div class="articleline2"></div>'.format(title, date) + ''.join(f_cont[3:])
                limited_body = ''.join(f_cont[3:8])
                rss_body = re.sub('<[^>]*>', '', limited_body)
                website_addr_plus_postname = self.cfg.get('important', 'address') + 'post/' + date.split("-")[0]\
                 + '/' + date.split("-")[1] + '/' + post + '/'
                # date[0], filename[1], title[2], post_body[3], limited_body[4], rss[5],
                # website_plus_post[6], index_post[7], archive_links[8], recent_posts[9]
                self.one_dict[post] = (date, post,
                   title , post_body, limited_body, rss_body, website_addr_plus_postname,
"<div class=" + date + "><a href='" + website_addr_plus_postname + "'><h1>" + title + "</h1></a><div class='articleline2'></div>" + limited_body + \
"</div><br /><a href='" + website_addr_plus_postname + "' class="+action_button+"><span><b>Read more</b></span></a><br /><br /><br />",
"<span>" + date + "</span><a href='" + website_addr_plus_postname + "'>" + '&nbsp;' +  title + "</a><br />",
"<li class=" + date + "><a href='" + website_addr_plus_postname + "'>" + '<span>' + title + '</span>'+ "</a></li>")

        if os.path.exists('generated/post/'):
            shutil.rmtree('generated/post/')
        for z in sorted(self.one_dict.values(), reverse=True):
            os.makedirs("generated/post/{year}/{month}/{post}/"\
                .format(year=z[0].split("-")[0], month=z[0].split("-")[1], post=z[1]))

        archive_body = str()
        for post_addr, number in zip(sorted(self.one_dict.values(), reverse=True),\
            reversed(range(1, len(self.one_dict.values()) + 1))):
            archive_body += "#" + str(number) + " - " + post_addr[8]

        self.recent_posts = str()
        for x,z in zip(sorted(self.one_dict.values(), reverse=True),\
            range(self.cfg.getint('customizations', 'number of recent posts'))):
            self.recent_posts += x[9]

        index_body = str()
        for x,z in zip(sorted(self.one_dict.values(), reverse=True),\
            range(self.cfg.getint('customizations', 'number of posts on front page'))):
            index_body += x[7]

        self.start_rss()

        self.tags_body = str()
        if self.cfg.get('customizations', 'tags'):
            self.start_tags()

        for x in sorted(self.one_dict.values(), reverse=True):
            split_x = x[0].split("-")
            WriteToFile('7', split_x[0], split_x[1], x[1],
                hf_post.replace("titlefixed", x[2]), x[3],
                    footer_p.replace('<!-- tags_bar2 -->', self.tags_body)
                    .replace("<!-- recent posts -->", self.recent_posts))

        fi_repl_recent_posts = footer_i.replace('<!-- tags_bar2 -->', self.tags_body)\
        .replace("<!-- recent posts -->", self.recent_posts)

        if len(self.one_dict.keys()) > self.cfg.getint('customizations', 'number of posts on front page'):
            WriteToFile('1', header, index_body, fi_repl_recent_posts\
               .replace("<!-- pagination -->", '<div class="page-navigation cf">\
               <div class="nav-previous"><a href="{older}">Older Entries</a></div></div>'
               .format(older=self.cfg.get('important', 'address') + 'page/1/')))
            for x,z in zip(sorted(self.one_dict.values(), reverse=True),
               range(self.cfg.getint('customizations', 'number of posts on front page'))):
               del self.one_dict[x[1]]
            self.start_pagination()
        else:
            WriteToFile('1', header, index_body, fi_repl_recent_posts)

        WriteToFile('2', archive_header, archive_body, fi_repl_recent_posts)
        WriteToFile('3', forum_header, fi_repl_recent_posts)
        WriteToFile('4', search_header, fi_repl_recent_posts)

if __name__ == '__main__':
    Blogfy()