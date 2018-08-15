#---------------------------------------------
# Archlinux functions
#---------------------------------------------

######## Pacman ########
# Update
Syu() { sudo pacman -Syu ;}

# Search
Ss() { pacman -Ss $@ ;}

# Install
S() { sudo pacman -S $@ ;}

# Remove
R() { sudo pacman -R $@ ;}

# Remove including deps
Rsnc() {
    sudo pacman -Rsnc $@

    for x in $@
    do

        # VLC metadata >> /dev/null
        [[ $x == 'vlc' ]] && {
            sed -i 's/list=.*//g;s/times=.*//g' \
                "${XDG_CONFIG_HOME}/vlc/vlc-qt-interface.conf"
            rm -rf {${XDG_DATA_HOME},${XDG_CACHE_HOME}}/vlc
        }

        # qbittorrent metadata >> /dev/null
        [[ $x == 'qbittorrent' ]] && \
            rm -rf ${XDG_CONFIG_HOME}/qBittorrent/qBittorrent-* \
                ${XDG_CACHE_HOME}/qBittorrent \
                ${XDG_DATA_HOME}/data/qBittorrent/BT_backup
    done
;}

# Query and search
Qqs() { pacman -Qqs $1 ;}

# Query and get information
Qi() { pacman -Qi $@ ;}

# List the package(s) content
# Useful when some executable has
# different name than the package one...
Ql() { pacman -Ql $@ ;}

# List all foreign packages
Qm() { pacman -Qm ;}

# Compile, build, sign and
# install package via PKGBUILD script
mkpkg() {
    set -A chkpkg
    chkpkg=('pkg-config' 'fakeroot'
            'intltool' 'autoconf'
            'automake' 'bison'
            'flex' 'gawk'
            'gnupg'
)

    for x in "${chkpkg[@]}"
    do
        pacman -Qqn "${x}" > /dev/null 2>&1
        [[ $? != 0 ]] && {
            printf '%s\n' "Missing: "${x}", installing it for you."
            S "${x}" --noconfirm
        }
    done

    set -A key_found gawk_cmd
    # Get more than one public key in a row
    # then `source' the validpgpkeys array
    # to make the 'for' loop life easier
    gawk_cmd=(
        '/^validpgpkeys/ {
            for (x=1; x<15; x++)
            {
                print;
                getline;
                if (match($0, /)/)) {
                    if (substr($0,length,1) == ")")
                        print ")";
                    break;
                }
            }
        }'
)
    key_found=$(gawk "${gawk_cmd[@]}" PKGBUILD)

    # trust 5 quit
    [[ ! -z "${key_found}" ]] && {
        echo "${key_found[@]}" > '/tmp/delme'
        source '/tmp/delme'

        for x in ${validpgpkeys#*=}
        do
            gpg --list-keys --with-fingerprint \
                --keyid-format 0xLONG \
                    "${x}" >/dev/null 2>&1 || {
                gpg --recv-key "${x}"
                gpg --edit-key "${x}"
            }
        done
    }

    local _pkgs='/var/custompkgs'
    #[[ ! -z $1 ]] && local _pkgname=$1 || \
    #    local _pkgname=$(gawk -F '=' '/^pkgbase/ {print $2}' PKGBUILD)

    makepkg --clean --install --force --syncdeps --rmdeps --sign

    #[[ ! -z ${key_found} ]] && gpg --delete-key ${key_found}

    __fileExists *.pkg.tar.xz
    [[ $? == 0 ]] && {
        sudo cp -r *.pkg.tar.xz{,.sig} ${_pkgs}
        #sudo rm -rf /var/cache/pacman/pkg/${_pkgname}-*.tar.xz
        for x in "${_pkgs}"/*.tar.xz
        do
            sudo repo-add --quiet "${_pkgs}/custom.db.tar.gz" \
                "${x}" > /dev/null 2>&1
        done
        unset x
        Syu
    }
;}

# The purpose of this function is to
# bring more flexibillity than speed gains.
compabs() {
    __am_i_null $1 && return 1

    local match_pkg=`find /var/abs -type d -name $1`

    __am_i_null ${match_pkg} && return 1

    local pkg_basename="/tmp/${match_pkg##*/}"

    cp --recursive ${match_pkg} /tmp
    cd ${pkg_basename}
    mkpkg ${match_pkg##*/}

;}


# https://projects.archlinux.org/svntogit/packages.git/tree/
# Sometimes ABS isn't up-to-date, download
# the desired package from the SVN repo instead
compsvn() {
    __am_i_null $1 && return 1

    pacman -Qqn 'hgsvn' > /dev/null 2>&1
    [[ $? != 0 ]] && {
        printf '%s\n' "Missing: hgsvn, installing it for you."
        S 'hgsvn' --noconfirm
    }
    cd '/tmp'

    svn checkout --depth=empty svn://svn.archlinux.org/packages
    svn update "packages/$1"

    [[ ! -d "packages/$1" ]] && {
        printf '%s\n' "There is no $1 in the svn repo. Trying ABS instead."
        S 'abs' --noconfirm
        sudo abs
        compabs $1
        return 1
    }

    [[ $1 == 'linux' ]] && [[ -d "packages/$1/repos/testing-x86_64" ]] && {
        cd "packages/$1/repos/testing-x86_64"
        mkpkg $1
        return 0
    }

    cd "packages/$1/trunk"
    mkpkg $1

    rm --recursive --force "$HOME/.subversion"
}


# List orphans
orphans() { pacman -Qtdq ;}

# List explicitly installed packages.
# Explicitly means a package installed
# on purpose by you. If you don't need
# or use some package then is there are
# any particular reason to keep it ?
myshit() { pacman -Qqet ;}

# Remove all 32-bit libraries
remmulti() { R $(paclist multilib | gawk '{print $1}') ;}

######## End Of Pacman ########


# Change the system language.
# Open up '/etc/locale.gen' and uncomment
# the desired language locale(s), example:
# #de_DE.UTF-8 UTF-8 -> de_DE.UTF-8 UTF-8
# Run 'locale-gen', after that you can
# use this function. Once you 'setlang de/en'
# logout & login again.
setlang() {
  [[ $1 == 'en' ]] && local laNg='LANG="en_US.UTF-8"' \
      || local laNg='LANG="de_DE.UTF-8"'

  __WriteTo /etc/locale.conf "${laNg}"
}

# Remove all recently installed dependencies.
# A backup file before the deps. was installed
# is needed. pacman -Qqn > myoldpacks.txt
remdeps() {
    pacman -Qqn > /tmp/new
    cp -r "${dothomez}/OPEN_ME/installed_packages.txt" /tmp/old

    compare /tmp/old /tmp/new | gawk '/^+/ {if (NR > 3) {gsub("+",""); print $1 }}' > /tmp/allpacks
    Rsnc $(</tmp/allpacks)
;}

# clean /var/cache/pacman/pkg/
pkgclean() { sudo pkgcacheclean --verbose 2 ;}
