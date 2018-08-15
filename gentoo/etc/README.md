Static ip (/etc/conf.d/net):

The lazy way:

```

config_eth0="10.10.10.15 netmask 255.255.255.0"
routes_eth0="default gw 10.10.10.10.1"
dns_servers_eth0="ip1 ip2"

```

```

ln -s /etc/init.d/net.lo /etc/init.d/net.eth0
rc-update add net.eth0 default

```

The file **conf.d/net** points to the address 'null' on purpose. I have several functions that assign random ip and mac addresses, another one that starts dnsmasq and dnscrypt-proxy. See my network.zsh and crypto-misc.zsh functions in $HOME/.config/zsh/functions/
