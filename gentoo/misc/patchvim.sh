THEPKGB='/tmp/vim/PKGBUILD'

sed -i "s/pkgname=('vim-minimal' 'vim' 'vim-python3' 'gvim' 'gvim-python3' 'vim-runtime')/pkgname=('gvim' 'vim-runtime')/g" ${THEPKGB}

sed -i "s/'ruby'//g" ${THEPKGB}
sed -i "s/'python'//g" ${THEPKGB}
sed -i "s/'lua'//g" ${THEPKGB}
sed -i "s/'gpm'//g" ${THEPKGB}

sed -i "s/--enable-gpm/--disable-gpm/g" ${THEPKGB}
sed -i "s/--enable-pythoninterp/--disable-pythoninterp/g" ${THEPKGB}
sed -i "s/--enable-python3interp/--disable-python3interp/g" ${THEPKGB}
sed -i "s/--enable-netbeans/--disable-netbeans/g" ${THEPKGB}
sed -i "s/--enable-perlinterp/--disable-perlinterp/g" ${THEPKGB}
sed -i "s/--enable-luainterp/--disable-luainterp/g" ${THEPKGB}
sed -i "s/--enable-rubyinterp/--disable-rubyinterp/g" ${THEPKGB}


patch ${THEPKGB} 'my_gvim.diff'

unset THEPKGB
