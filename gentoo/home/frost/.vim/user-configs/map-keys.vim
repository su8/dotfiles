" CTRL + SHIFT + V to paste something external (not yank)
:nnoremap <C-S-V> "+gP

" CTRL + F1 to hide or display the menu bar in gvim
:nnoremap <C-F1> :if &go=~#'m'<Bar>set go-=m<Bar>else<Bar>set go+=m<Bar>endif<CR>

" Next tab
:nnoremap <silent> tn :tabnext<CR>

" Previous tab
:nnoremap <silent> tp :tabprevious<CR>

" New tab
:nnoremap <silent> to :tabnew<CR>

" F5 to switch buffer by number
:nnoremap <F5> :tabnew<CR>:buffers<CR>:buffer<Space>

" Consider wrapped lines as real one
:nnoremap j gj
:nnoremap k gk

" space bar un-highlights and clears the search register
:noremap <silent> <Space> :silent nohlsearch<CR>

" F12 to compile some project
:nnoremap <F12> :make<CR>:cw<CR>

" Convert opened file to pdf, used mostly to highlight code
" :nnoremap <F12> :hardcopy > /tmp/%.ps<CR>:!gs -dBATCH -dNOPAUSE -dQUIET -dSAFER -sDEVICE=pdfwrite -sOutputFile=/tmp/%.pdf /tmp/%.ps<CR>

" F8 to compile and run C program
:nnoremap <F8> :!gcc -Wall -O2 -Wextra -Wundef -Wwrite-strings -Wcast-align -Wstrict-overflow=5 -W -Wshadow -Wconversion -Wpointer-arith -Wstrict-prototypes -Wformat=2 -Wmissing-prototypes -o /tmp/TempFiLe % ; [[ -f /tmp/TempFiLe ]] && /tmp/TempFiLe; rm -rf /tmp/TempFiLe<CR>

" :cd. change working directory to the current file
:cmap cd. lcd %:p:h

" directory listing in a sidebar
:nnoremap <F3> :NERDTreeToggle<CR>

" switch to the current dir
:nnoremap <F2> :lcd %:p:h<CR>:NERDTreeCWD<CR>

" jshint2 lint errors, prev <-> next
" :nnoremap <F6> :lprevious<CR>
" :nnoremap <F6> :TagbarToggle<CR>
:nnoremap <F7> :lnext<CR>

" toggle the undo-tree panel 
:nnoremap <F4> :UndotreeToggle<CR>
