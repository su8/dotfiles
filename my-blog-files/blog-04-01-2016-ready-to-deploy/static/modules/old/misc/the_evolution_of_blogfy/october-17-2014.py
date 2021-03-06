import os
from re import sub
from shutil import rmtree
try:
    from configparser import ConfigParser
    python3 = True
except ImportError:
    from ConfigParser import ConfigParser
    python3 = False
from strings_to_format import Whoop
from templates import CuRRenT

class GenerateBlog(object):
    def gett(self, attr):
        return getattr(Whoop, attr)

    def important_var(self, var):
        return self.cfg.get('important', var)

    def open_and_write(self, filename, body):
        with open(filename, 'wt') as filee:
            filee.write(body)

    def custom(self, var):
        return self.cfg.get('customizations', var)

    def read_static(self, filename):
        with open(filename, 'rt') as static_file:
            return static_file.read()

    def replace_user_variables(self, post_bdy):
        for var, val in self.cfg.items('user variables'):
            post_bdy = post_bdy.replace(var, val)
        return post_bdy

    def write_to_file(self, filename, *args):
        path_join  = os.path.join
        given_args = [x for x in args]
        write_to   = {'1': 'index.html', '2': 'archive.html',
                      '3': given_args[0] + '.xml',
                      '4': path_join('tags', given_args[0], 'index.html'),
                      '5': (path_join('post', given_args[0], 'index.html')
                                          if len(given_args) > 2 else str()),
                      '6': 'contact.html'}
        if filename in ['3', '4', '5']:
            del given_args[0]
        cur_file = path_join('generated', write_to[filename])\
                       .replace(path_join('generated', 'sitemap.xml'), 'sitemap.xml')
        self.open_and_write(cur_file, str().join(given_args))

    def get_footer_version(self, given_footer):
        github_ver    = (self.github if given_footer == 'i' else self.github2) 
        footer_ip_two = (self.footer_i if given_footer in ['i', 'two'] else self.footer_p)
        return footer_ip_two.replace('<!-- tags_bar -->', self.tags_sidebar)\
                .replace('<!-- tags_body -->', self.tags_body)\
                .replace('<!-- recent_bar -->', self.recent_sidebar)\
                .replace('<!-- recent_posts -->', self.recent_posts)\
                .replace('<!-- github -->', github_ver)\
                .replace('<!-- github_sidebar -->', self.git_sidebar)\
                .replace('github_account_name', self.cfg.get('social', 'github account name'))

    def start_sitemap(self, url_loc_lastmod=list()):
        from time import strftime, localtime
        os.chdir('generated')
        mtime        = os.path.getmtime
        date_f       = '-'.join(self.custom('date format').split()).replace('*', '%')
        address      = self.address
        path_join    = os.path.join
        path_split   = os.path.split
        curdir_sep   = os.curdir + os.sep
        curdir_post  = path_join(os.curdir, 'post')
        sitemap_loc  = self.gett('sitemap_loc')
        txt_post_loc = os.getcwd().replace('generated', str()) + path_join('static',
                                                              'text posts') + os.sep
        for root, _, files in os.walk(os.curdir):
            for name in files:
                if name.endswith('.html'):
                    if root.startswith(curdir_post):
                        time_of_last_mod = mtime(txt_post_loc + path_split(root)[1])
                    else:
                        time_of_last_mod = mtime(name)
                    strftime_last_mod    = strftime(date_f, localtime(time_of_last_mod))
                    found_file = path_join(root, name).replace(curdir_sep, address)
                    url_loc_lastmod.append(sitemap_loc\
                                                .format(found_file, strftime_last_mod))
        sitemap_body = self.gett('sitemap').format(str().join(url_loc_lastmod))
        self.write_to_file('3', 'sitemap', sitemap_body)

    def start_tags(self, sec_dict=dict(), temp_list=list()):
        tg   = [x.lstrip(' ') for x in self.custom('tags').split(',')]
        span = self.gett('span')
        for z in self.sorted:
            for x in tg:
                if x in z[3]:
                    if not x in sec_dict:
                        sec_dict[x] = [span.format(z[0], z[6], z[2])]
                    else:
                        sec_dict[x].append(span.format(z[0], z[6], z[2]))

        font_plus_link = self.gett('font_link')
        for x,z in sec_dict.items():
            if len(z) < 15:
                self.tags_body += font_plus_link.format(16, self.address, x)
            elif 15 >= len(z) < 18:
                self.tags_body += font_plus_link.format(21, self.address, x)
            else:
                self.tags_body += font_plus_link.format(34, self.address, x)
            tags_dir = os.path.join('generated', 'tags', x)
            if not tags_dir in temp_list:
                os.makedirs(tags_dir)
                temp_list.append(tags_dir)

        footer_ii   = self.get_footer_version('two')
        write_to_f  = self.write_to_file
        header_pagi = self.hf_pagination
        for x,z in sec_dict.items():
            write_to_f('4', x, header_pagi,
                'tag: {0}<br />{1}'.format(x, str().join(z)), footer_ii)

    def start_rss(self, rss_item=str()):
        item_pubdate = self.gett('rss_item')
        for x,_ in zip(self.sorted, self.range):
            rss_item += item_pubdate.format(x[2], x[0], x[6], x[5])
        rss_body = self.gett('rss').format(self.important_var('name'),
                     self.address, self.important_var('description'), rss_item)
        self.write_to_file('3', 'rss', rss_body)

    def start_pagination(self, page_number=0):
        footer_ii    = self.get_footer_version('two')
        path_join    = os.path.join
        pagi_posts   = self.pagi_posts
        open_and_w   = self.open_and_write
        header_pagi  = self.hf_pagination
        target_range = self.range
        pagi_old_new = self.gett('older_newer')
        adr_page_num = self.address + 'page/{0}/'
        while pagi_posts:
            posts_as_body = str()
            for _ in zip(pagi_posts, target_range):
                posts_as_body += pagi_posts[0]
                del pagi_posts[0]

            page_number   += 1
            pagination_dir = path_join('generated', 'page', str(page_number))
            pag            = path_join(pagination_dir, 'index.html')
            os.makedirs(pagination_dir)
            open_and_w(pag, header_pagi + posts_as_body + \
                    footer_ii.replace('<!-- pagination -->', pagi_old_new
                        .format((self.address if not page_number > 1
                           else adr_page_num.format(page_number - 1)),
                                adr_page_num.format(page_number + 1))))

        # The last pagination page does not have to contain "Older Entries" button
        repl_str = self.read_static(pag).replace(self.gett('last_page')
                        .format(adr_page_num.format(page_number + 1)), str())
        open_and_w(pag, repl_str)

    def __init__(self):
        self.cfg      = ConfigParser()
        (self.cfg.read('config.ini') if python3 else self.cfg.readfp(open('config.ini')))
        template      = self.custom('template in use')
        template_body = getattr(CuRRenT, template).split('<!-- split_here -->')
        self.address  = self.important_var('address')

        def f_to_gen(say_what):
            return self.cfg.getboolean('advanced customizations', say_what)

        def replace_template_comments(given_template, shark, dots=str()):
            return ' '.join(given_template.replace('<!-- whoami -->', shark)
                .replace('<!-- title -->', self.important_var('name'))
                .replace('<!-- dotz -->', dots)
                .replace('<!-- charset -->', self.custom('blog charset'))
                .replace('<!-- addr -->', self.address)
                .replace('<!-- author -->', self.cfg.get('important', 'author'))
                .replace('<!-- description -->', self.important_var('description'))
                .replace('<!-- pagi_or_comment -->', shark)
                .replace('<!-- recent_bar -->', (self.gett('recent_bar') if f_to_gen('recent posts sidebar') else str()))
                .replace('<!-- footer_text -->', self.custom('footer text'))
                .replace('<!-- ct -->', (self.gett('contact') if shark == 'Contact'
                                                              else str())).split())
        dot_2              = '../../'
        top                = template_body[0]
        bottom             = template_body[1]
        header             = replace_template_comments(top, '<!-- title -->')
        hf_post            = replace_template_comments(top, '<!-- title_post -->', dot_2)
        self.hf_pagination = replace_template_comments(top, '<!-- title -->', dot_2)
        archive_header     = replace_template_comments(top, 'Archive')
        self.footer_p      = replace_template_comments(bottom, '<!-- comment_section -->')
        self.footer_i      = replace_template_comments(bottom, '<!-- pagination -->')
        contact_header     = replace_template_comments(top, 'Contact')

        #if f_to_gen('disqus comments'):
            #self.footer_p  = self.footer_p.replace('<!-- comment_section -->', self.gett('disqus'))\
                                #.replace('blogfy_', self.cfg.get('social', 'disqus shortname'))

        sidebar            = self.gett('sidebar')
        self.github        = str()
        self.github2       = str()
        self.git_sidebar   = str()
        #if f_to_gen('github sidebar') and self.cfg.get('social', 'github account name'):
            #remain           = '{$("#github-projects").loadRepositories("github_account_name");});'
            #git_base         = self.gett('git_base')
            #self.github      = git_base.format(str(), remain)
            #self.github2     = git_base.format(dot_2, remain)
            #self.git_sidebar = sidebar.format(self.gett('github_sidebar'))

        self.recent_sidebar      = str()
        #if f_to_gen('recent posts sidebar'):
            #self.recent_sidebar  = sidebar.format(self.gett('recent_sidebar'))

        the_body      = self.gett('post_body')
        read_static   = self.read_static
        repl_usr_var  = self.replace_user_variables
        address       = self.address
        path_join     = os.path.join
        static_txt    = path_join('static', 'text posts')
        self.one_dict = dict()
        for post in os.listdir(static_txt):
            f_cont        = read_static(path_join(static_txt, post))
            f_cont        = repl_usr_var(f_cont).split('\n')
            title         = f_cont[0][8:]
            date          = f_cont[1][8:]
            author        = f_cont[2][8:]
            post_body     = the_body.format(title, date, author)\
                                                       + str().join(f_cont[4:])
            limited_body  = str().join(f_cont[4:8])
            rss_body      = sub('<[^>]*>', str(), limited_body)
            addr_postname = address + 'post/' + post + '/'
            self.one_dict[post] = (date, post, title, post_body, limited_body,
                                    rss_body, addr_postname,
                                    "<div class=" + date + "><a href='" + addr_postname + "'><h1>" + title + "</h1></a><div class='articleline2'></div>" + limited_body + \
                                    "</div><br /><a href='" + addr_postname + "' class='btn btn-primary btn-sm'>Read more</a><br /><br /><br />",
                                    "<span>" + date + "</span><a href='" + addr_postname + "'>" + '&nbsp;' +  title + "</a><br />",
                                    "<li class=" + date + "><a class='list-group-item' href='" + addr_postname + "'>" + '<span>' + title + '</span>'+ "</a></li>")
        # date[0], filename[1], title[2], post_body[3], limited_body[4], rss[5],
        # website_plus_post[6], index_post[7], archive_links[8], recent_posts[9]

        def gdir(*folder):
            return [path_join('generated', x) for x in folder]
        for x in gdir('page', 'post', 'tags'):
            if os.path.exists(x):
                rmtree(x)

        self.sorted  = sorted(self.one_dict.values(), reverse=True)
        archive_body = str()
        for p, number in zip(self.sorted, reversed(range(1, len(
                                                  self.one_dict.keys()) + 1))):
            archive_body += '#' + str(number) + ' - ' + p[8]
            os.makedirs(path_join('generated', 'post', p[1]))

        self.recent_posts = str()
        if f_to_gen('recent posts sidebar'):
            self.recent_posts = str().join(x[9] for x,_ in zip(self.sorted, range(
                    self.cfg.getint('customizations','number of recent posts'))))

        self.num_of_fp_posts = self.cfg.getint('customizations', 'number of posts on front page')
        self.range = range(self.num_of_fp_posts)
        index_body = str().join(x[7] for x,_ in zip(self.sorted, self.range))

        if f_to_gen('rss'):
            self.start_rss()

        self.tags_body    = str()
        self.tags_sidebar = str()
        if f_to_gen('tags sidebar') and self.custom('tags'):
            self.tags_sidebar = self.gett('tags_sidebar')
            self.start_tags()

        write_to_f           = self.write_to_file
        fp_repl_recent_posts = self.get_footer_version('p')
        for x in self.sorted:
            write_to_f('5', x[1],
                hf_post.replace('<!-- title_post -->', x[2]),
                    x[3], fp_repl_recent_posts)

        fi_repl_recent_posts = self.get_footer_version('i')

        no_pagination = True
        if f_to_gen('pagination'):
            if len(self.one_dict.keys()) > self.num_of_fp_posts:
                write_to_f('1', header, index_body.replace('\n', str()),
                    fi_repl_recent_posts.replace('<!-- pagination -->',
                        self.gett('front_pagi').format(address)))
                self.pagi_posts = [x[7] for x in self.sorted]
                [self.pagi_posts.pop(0) for _ in self.range]
                no_pagination   = False
                self.start_pagination()

        if no_pagination:
            write_to_f('1', header, index_body, fi_repl_recent_posts)
        write_to_f('2', archive_header, archive_body, fi_repl_recent_posts)
        write_to_f('6', contact_header, fi_repl_recent_posts)
        if f_to_gen('sitemap'):
            self.start_sitemap()