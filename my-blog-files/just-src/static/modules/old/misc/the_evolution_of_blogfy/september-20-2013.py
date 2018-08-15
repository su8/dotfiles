import os
import sys
import codecs
import string
import re
import markdown2
from website_settings import Settings


# If you executed this version of build.py with python 3, while it is written for python 2.7, it will remind you and exit
maximum_version = (2, 8)
current_version = sys.version_info

if current_version > maximum_version:
    sys.exit("""
The program must be executed with python version of 2.7
""")
else:
    print("")

page2 = ""
index_posts, recent_posts, forum_posts, search_posts, archive_links = [], [], [], [], []
action_button = '"action-button"'
# Return a list containing the names of the entries in the directory given by path "/md/"
posts = os.listdir(os.getcwd() + "/md/")

# opens are rewrites all the content in these five pages, also if you create another
# page add it here: ('site/rss.html','rss_file') , also see the bottom - inst_dict['']

inst_dict = {}
for file in [('site/index.html', 'index_file'), ('site/archive.html', 'archive_file'), ('site/forum.html', 'forum_file'), ('site/search.html', 'search_file'), ('site/rss.xml', 'rss_file')]:
    inst_dict[file[1]] = codecs.open(file[0], mode='w', encoding='utf8')

def rss(posts, rss_file):
  rss_body = """<rss version="2.0">
  <channel>
  \t<title>""" + Settings.site_name + """</title>
  \t<link>""" + Settings.site_root + """</link>
  \t<description>""" + Settings.site_description + """</description>"""
  posts_dates = []
  for post in posts:
    input_file = codecs.open("md/" + post, mode="r", encoding="utf8")
    file_content = input_file.read()

    file_content_lines = string.split(file_content, '\n')
    title = string.replace(file_content_lines[0], '# ', '')
    title = string.replace(title, ' #', '')
    date = file_content_lines[2]
    input_file.close()
    posts_dates.append(date + "**" + title + "**" + post)
    posts_dates.sort()
    posts_dates.reverse()

  for p in posts_dates:
    post_pieces = string.split(p, "**")
    rss_body += """\n\t\t<item>
    \t<title>""" + post_pieces[1] + """</title>
    \t<pubDate>""" + post_pieces[0] + """</pubDate>
    \t<link>""" + Settings.site_root + post_pieces[2] + ".html" + """</link>
    \t<description>""" + "Read the full article : "  + Settings.site_root + post_pieces[2] + ".html" + """</description>
    </item>"""

  rss_body += "\n\t</channel>\n</rss>"
  rss_file.write(rss_body)
  rss_file.close()

# opens,reads and includes the content from static/xxx to the particular file(s)


class staticFile:

    def __init__(self, filename):
        self.filename = filename

    def __call__(self):
        with codecs.open(self.filename, mode="r", encoding="utf8") as a:
            return a.read()

    def __str__(self):
        return self.filename


# template-1 vintage, template-2 yellow, template-3 bootstrap, template-4 white
def remind_usage():
    sys.exit("""Usage:  python build.py --template1

side note - blogfy comes with 4 templates
""")


if len(sys.argv) == 2:
    all_templates = ('--template1', '--template2', '--template3', '--template4')
    if not sys.argv[1].startswith(all_templates):
        remind_usage()
    if sys.argv[1].startswith('--template'):
        option = sys.argv[1][2:]
        if option.startswith('template'):
            hf = staticFile("static/{}/header".format(option))
            header = hf()
            header = string.replace(header, "site_description", Settings.site_description)
            fh = staticFile("static/{}/header_forum".format(option))
            forum_header = fh()
            forum_header = string.replace(forum_header, "site_description", Settings.site_description)
            sh = staticFile("static/{}/header_search".format(option))
            search_header = sh()
            search_header = string.replace(search_header, "site_description", Settings.site_description)
            ah = staticFile("static/{}/header_archive".format(option))
            archive_header = ah()
            archive_header = string.replace(archive_header, "site_description", Settings.site_description)
            fp = staticFile("static/{}/footer_post".format(option))
            footer_p = fp()
            footer_p = string.replace(footer_p, "footer_text", Settings.footer_text)
            fi = staticFile("static/{}/footer".format(option))
            footer_i = fi()
            footer_i = string.replace(footer_i, "footer_text", Settings.footer_text)
elif len(sys.argv) != 2:
    remind_usage()

else:
    remind_usage()

# opens, reads the title, date and the text,
# then converts all posts from md folder to html files
for post in posts:

    input_file = codecs.open("md/" + post, mode="r", encoding="utf8")
    # how many characters to show for each post in your index page, default is 400.
    file_content = input_file.read(400)
    file_content_lines = string.split(file_content, '\n')
    title = file_content_lines[0]
    date = file_content_lines[2]
    input_file.close()

    md = markdown2.Markdown()
    html = md.convert(file_content)

# this is regex, don't change anything after " = ", it searches this specific
# div and includes everything below this div in the particular page from your md file(s)
    html_post_start = re.search('<div class="articleline2">', html)

    # basic html knowledge will help you to understand these 2 lines below
    index_posts.append("<div class=" + date + "><a href='" + page2 + post + ".html'><h1>" + string.replace(title, '#', '') + "</h1></a>" + html[html_post_start.start():] + "</div><br /><a href='" + page2 + post + ".html' class="+action_button+">READ MORE</a><br /><br /><br />")
    archive_links.append("<span>" + date + "</span><a href='" + page2 + post + ".html'>" + string.replace(title, '#', '') + "</a><br />")

    # sort recent posts for other pages, if you create another page add it here
    for other_pages in recent_posts, forum_posts, search_posts:
        other_pages.append("<li class=" + date + "><a href='" + page2 + post + ".html'>" + string.replace(title, '#', '') + "</a></li>")
        other_pages.sort()
        other_pages.reverse()
    # sort the posts in [in]dex and [ar]chive pages = inar
    for inar in archive_links, index_posts:
        inar.sort()
        inar.reverse()

# how many recent posts to display, the default number is 12
postgroup = ""
postgroup_count = 0
for post in recent_posts:
    if(postgroup_count < Settings.number_of_recent_posts):
        postgroup = postgroup + post
    postgroup_count += 1

# how many posts to display in the main page, the default number is 5
index_body = ""
index_post_count = 0
for link in index_posts:
    if (index_post_count < Settings.number_of_posts_on_front_page):
        index_body = index_body + link
    index_post_count += 1

# opens the index header and default footer (footer, not footer_post) and replaces the
# title with index, also it tells to sort and include all latest recent + main posts
index_header = string.replace(header, "titlefixed", Settings.site_name)
# index_header = string.replace(index_header, "website_template", Settings.website_template)
inst_dict['index_file'].write(index_header + index_body + string.replace(footer_i, "<!-- recent posts -->", postgroup))
inst_dict['index_file'].close()

# opens, reads the title, date and the text,
# then converts all posts from md folder to html files
post_count = 0
for post in posts:

    post_count += 1
    input_file = codecs.open("md/" + post, mode="r", encoding="utf8")
    file_content = input_file.read()
    input_file.close()

    title = string.split(file_content, '\n')[0]

    md = markdown2.Markdown()
    html = md.convert(file_content)
    post_file = codecs.open("site/" + post + ".html", "w", encoding="utf8")

    titlefixed = string.replace(title, '#', '')
    titlefixed = string.replace(titlefixed, '\n', '')
    curr_header = string.replace(header, "titlefixed", titlefixed)
#    curr_header = string.replace(curr_header, "website_template", Settings.website_template)
    post_file.write(curr_header + html + string.replace(footer_p, "<!-- recent posts -->", postgroup))
    post_file.close()

# sort and adds " #16 - " in front of every link in the archive page, 16 is just example
archive_links_count = len(archive_links)
archive_body = ""
for link in archive_links:
    archive_body = archive_body + "#" + str(archive_links_count) + " - " + link
    archive_links_count -= 1

# opens the archive header and default footer (footer, not footer_post) and replaces the
# title with archive, also it tells to sort and include all latest recent posts
archive_header = string.replace(archive_header, "titlefixed", Settings.archive_page_name)
# archive_header = string.replace(archive_header, "website_template", Settings.website_template)
inst_dict['archive_file'].write(archive_header + archive_body + string.replace(footer_i, "<!-- recent posts -->", postgroup))
inst_dict['archive_file'].close()

# if you create another page add it here (contact_header, inst_dict['contact_file'])
lStuff = [(forum_header, inst_dict['forum_file']), (search_header, inst_dict['search_file'])]
for header, fosers in lStuff:
    header = string.replace(header, "titlefixed", Settings.site_name)
    fosers.write(header + string.replace(footer_i, "<!-- recent posts -->", postgroup))
    fosers.close

rss(posts, inst_dict['rss_file'])