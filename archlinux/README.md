Systemd users,

**/sbin/init** is the first file that the kernel will try to execute, so you don't need the whole **systemd-sysvcompat** package.

Just create symbolic link `ln --symbolic ../lib/systemd/systemd /sbin/init`. Make sure to type the command as is, otherwise the kernel will panic.

Install all the configuration files:

    sudo bash install1
    bash install2
