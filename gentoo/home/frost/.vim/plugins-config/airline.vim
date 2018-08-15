" populate patched air/powerline fonts
" da fonts have to be in your homie/.fonts
set guifont=DejaVu\ Sans\ Mono\ for\ Powerline\ 10

" which extensions to load
let g:airline_extensions=['branch', 'tabline']

" airline, rainbows, ponies
let g:airline_powerline_fonts=1         " populate patched air/powerline fonts
let g:airline#extensions#tabline#tab_nr_type=1 " show the tab number
let g:airline#extensions#tabline#show_tab_type=0 " hide tab type (far right)
let g:airline#extensions#tabline#show_close_button=0 " How many close buttons are needed here ?

" airline-fugitive taken from the airline documentation
let g:airline#extensions#branch#enabled=1 " fugitive integration
let g:airline#extensions#branch#empty_message='' " no branch detected
let g:airline#extensions#branch#displayed_head_limit=10 " trim branch name
let g:airline#extensions#branch#format=2 " foo/bar becomes bar

" airline-ctrlp integration
let g:airline#extensions#ctrlp#color_template='normal' " colour mode to use when activated
let g:airline#extensions#ctrlp#show_adjacent_modes=1 " show mru,buffer modes

let g:rainbow_active=1                  " The coders plugin - https://github.com/luochen1990/rainbow

if !has('gui_running')
  let g:airline_symbols = {}

  " unicode symbols
  let g:airline_left_sep = ''
  let g:airline_right_sep = ''
  let g:airline_symbols.crypt = '🔒'
  let g:airline_symbols.linenr = '␊'
  let g:airline_symbols.linenr = '␤'
  let g:airline_symbols.linenr = '¶'
  let g:airline_symbols.maxlinenr = '☰'
  let g:airline_symbols.maxlinenr = ''
  let g:airline_symbols.branch = '⎇'
  let g:airline_symbols.paste = 'ρ'
  let g:airline_symbols.paste = 'Þ'
  let g:airline_symbols.paste = '∥'
  let g:airline_symbols.spell = 'Ꞩ'
  let g:airline_symbols.notexists = '∄'
  let g:airline_symbols.whitespace = 'Ξ'
endif


" avoid tagbar as it clashes hardly with dwm.vim
