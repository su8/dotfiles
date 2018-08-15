## Reboot/Shutdown entry

edit /etc/grub.d/40_custom
```
#!/bin/sh
exec tail -n +3 $0
# This file provides an easy way to add custom menu entries.  Simply type the
# menu entries you want to add after this comment.  Be careful not to change
# the 'exec tail' line above.

menuentry "Reboot" --class reboot {
   reboot
}

menuentry "Shutdown" --class shutdown {
   halt
}
```
after that update grub (grub2-mkconfig -o ....)
