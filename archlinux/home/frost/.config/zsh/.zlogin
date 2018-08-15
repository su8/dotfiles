#---------------------------------------------
# Login shell acting as display manager
#---------------------------------------------

#source "${ZDOTDIR}/compile_arch_logo"

if [[ -z "$DISPLAY" ]] && [[ $(tty) == /dev/tty1 ]]
then
    xauth -qf "$HOME/.cache/.Xauthority" add ':0' . `mcookie`
    exec xinit xmonad -- :0 -auth "$HOME/.cache/.Xauthority" -nolisten tcp vt1
fi

# removed:
    #logout
    #clear
    #print_compiled_logo
    #sleep 2
    #exec startx --vt1
    #exec xinit openbox -- :0 -nolisten tcp vt1
