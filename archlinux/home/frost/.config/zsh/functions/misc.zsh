#---------------------------------------------
# Short and miscellaneous functions
#---------------------------------------------

# From now on I don't have to 'chmod'
cpr() { cp --verbose --preserve=mode --recursive $1 $2 ;}

# Check for process (when in doubt that's still running)
p() { ps -A | grep $1 ;}

# Query history
zhist() { grep -i "$1" "$ZDOTDIR"/histfile ;}

# Grab pid
pids() { ps aux | grep "$1" ;}

# refer to `man ps' for more details
vs() { ps awwlx --sort=vsz ;}

# `man ss' ; ss -untap
untap() { ss --all --numeric --tcp --udp --processes ;}

# Test my firewalls
pwnhost() { sudo nmap -sV -O -PN $1 ;}

# Show the difference between files/folders
compare() { diff -Nwaur $1 $2 ;}

# Reload zsh
rldzsh() { source "$XDG_CONFIG_HOME/zsh/.zshrc" ;}

# Rebuild the font cache
rldfonts() { sudo fc-cache --force --verbose ;}

# Ignore comment lines
nc() { egrep --invert-match "^[ \t]*#|^[ \t]*$" "$@" ;}

# Convert `man' page to pdf
manf() {
  man --troff "$1" | \
  gs -dBATCH -dNOPAUSE -dQUIET \
     -dSAFER -sDEVICE=pdfwrite \
     -sOutputFile="/tmp/$1_man.pdf" -
  exo-open "/tmp/$1_man.pdf"
}

# Query the compressed history,
# see `hgz' in "compress_extract.zsh"
xhist() { gunzip --to-stdout "$ZDOTDIR/hist.gz" | grep $1 ;}

# clear the copy and cache buffer (copied passwords for example)
clearbuff() { sudo sysctl --write vm.drop_caches=3 ;}

# query systemd log levels ["emerg", 0] ["err", 3]
errs() { journalctl --catalog --lines --priority=0..3 ;}

# For some reason the newer systemd release dumps
# all errors in the "system journal"
errs2() { sudo journalctl --system --catalog --lines --priority=0..3 ;}

# Do not reuse any Tor configuration file
remtor() { rm -rf /tmp/{INSTALL,LOG,VERSION} ;}

# `dd' image to external media
# type `info dd' to learn more.
# Usage: ddf /dev/NSA /path/to/iso
ddf() {
    { __am_i_null $1 || __am_i_null $2 } && return 1
    sudo dd if=$2 of=$1 bs=1M conv=fsync
;}

# Recursively `chmod' folders and files
chmodthis() {
    for x in $@
    do
        find $x -type d -print0 | xargs -0 chmod 700 2> /dev/null
        find $x -type f -print0 | xargs -0 chmod 600 2> /dev/null
    done
    unset x
;}

# Remove all wine traces
remwine() {
	Rsnc wine
	remmulti
	rm -rf $XDG_CONFIG_HOME/{wine,menus}
	rm -rf $XDG_DATA_HOME/{desktop-directories,icons,mime} \
        $XDG_DATA_HOME/applications/wine*
;}

# Search the given dir for images
# and start `sxiv' in thumbnail mode
thumbs() { sxiv -trq ${1:-PWD} ;}

# filter port 53 (dnsmasq)
antiscan() { sudo iptables -A INPUT -p tcp --dport 53 -j DROP ;}

# winff profile copied
# convert video file for my set-top box
convert() {
    echo -n "$@"
    /usr/bin/ffmpeg -y -i $@ -f avi -r 29.97 -vcodec libxvid -vtag XVID -vf scale=704:384 -aspect 16:9 -maxrate 1800k -b:v 1500k -qmin 3 -qmax 5 -bufsize 4096 -mbd 2 -bf 2 -trellis 1 -flags +aic -cmp 2 -subcmp 2 -g 300 -acodec libmp3lame -ar 48000 -b:a 128k -ac 2 $HOME/$(basename $@)
;}

# http://0pointer.de/blog/projects/systemd-for-admins-2.html
psc() { systemd-cgls ;}

# list all files that have been modified yesterday
# VFS won't be crawled, cool right ?
changes() { sudo find / -xdev -type f -mtime -1 >> /tmp/changes ;}

# Dead simple cpu stress test
cpustress() {
    local _num=0
    local _cores=$(gawk '/cpu cores/ {print $4;exit}' /proc/cpuinfo)

    while [[ ${_num} -lt ${_cores} ]]
    do
        cat /dev/urandom > /dev/null &
        let _num+=1
    done

    printf '%s\n' 'Close your terminal to stop the stress test'
;}

# See my tor-router configuration
# file to understand those options
torc() {
    set -A _opts
    _opts=(
        'ExcludeNodes {??},{gb},{us},{fr}'
        'AllowSingleHopCircuits 0'
        'ExcludeSingleHopRelays 1'
)
    for x in ${_opts[@]}
    do
        echo "${x}" >> /tmp/INSTALL/Browser/TorBrowser/Data/Tor/torrc-defaults
    done
    exit
;}

# quick `man' page search 'n match
mans() { man -k $1 ;}
