If you see the following messages printed in the terminal
when you start some program:

Gtk-WARNING **: Unable to locate theme engine in module_path: "mist"

Gtk-WARNING **: Unable to locate theme engine in module_path: "murrine"

Then open up /usr/share/themes/OMG/gtk-2.0/styles/inactivetext
and replace "mist" with "pixmap"

After that open up /usr/share/themes/OMG/gtk-2.0/styles/murrine-style-images-and-labels
and replace "murrine" with "pixmap"


Once you `mv' or `cp' OMG and Bridge,
you'll have to change their ownership:

sudo chown -R root /usr/share/themes/OMG

sudo chown -R root /usr/share/icons/Bridge