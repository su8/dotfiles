#---------------------------------------------
# backup functions ($HOME and '/etc' folders)
#---------------------------------------------


# do not touch those variables
docsz="$HOME/Documents"
real_homez="${docsz%/*}"
dirz="${docsz}/openbox"
homez="${dirz}${real_homez}"
confz="${homez}/.config"
xdg_conf="${XDG_CONFIG_HOME}"
dotfz="${docsz}/dotfiles"
dotdz="${dotfz}/archlinux-openbsd"
dothomez="${dotdz}${real_homez}"
dotconfz="${dothomez}/.config"
patchesz="${dirz}/patches"
blogdotz="${dotfz}/my-blog-files"
blogz="${docsz}/blog"
modulesz="${blogdotz}/static/modules"
archnamez='openbox'
archivez="${docsz}/${archnamez}.tar.gz"
ob_etc="${dirz}/etc"
dot_etc="${dotdz}/etc"


source "${xdg_conf}/misc/backup.conf"

# The primary backup function
ob() {
    cd "${docsz}"

    for x in ${TO_BACKUP[@]}
    do
       rem_str="${x/\/home\/frost/}"
       rm --recursive --force ${homez}${rem_str}
       mkdir --parent ${homez}${rem_str%/*}
       cp --recursive $x ${homez}${rem_str}
    done
    unset x rem_str

    # Will not include foreign packages
    pacman -Qqn > "${homez}/OPEN_ME/installed_packages.txt"

    rm --force "${confz}/Thunar/accels.scm" ${archivez}

    cp '/var/log/pacman.log' "${dirz}/misc"

    compressgz ${archnamez}
    cp --recursive ${archivez} "${docsz}/mega-drive"
;}


# The dofiles repo folder
dot() {
    ob

    # replace the whole dotfiles $HOME and '/etc'
    __replace_folder "${dothomez}" "${homez}"
    __replace_folder "${dot_etc}" "${ob_etc}"

    # language spoofing patches
    patch "${dotconfz}/zsh/functions/archlinux.zsh" "${patchesz}/zsh_archfunc_lang.patch"
    patch "${dotconfz}/openbox/autostart" "${patchesz}/autostart.patch"

    # do not share some of the following files
    rm --recursive --force ${dothomez}/OPEN_ME/{gnupg,offsite} \
        ${dothomez}/.config/zsh/{functions\/not_included,hist.gz,histfile} \
        ${blogdotz}/{config.ini,generate.py,static} \
        ${dothomez}/.config/{misc/dns_servers,dwm_scripts/barpatches}

    # backup my blog configs and posts
    cp --recursive ${blogz}/{config.ini,generate.py,static} ${blogdotz}
    rm --force ${modulesz}/blogfy.{pyc,pyo}              \
               ${modulesz}/functions.{pyo,pyc}           \
               ${modulesz}/strings_to_format.{pyc,pyo}   \
               ${modulesz}/templates.{pyo,pyc}
;}
