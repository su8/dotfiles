set wrap nolist                         " soft wrap
"set textwidth=80
"set lines=45 columns=80                 " initial size of g/vim window
set t_Co=256                            " ALL the colours!
set ttyfast                             " don't lag
set cursorline                          " track position
set nocompatible                        " leave the old ways behind…
"set nowrap                              " don't wrap lines
set nobackup                            " disable backup files (filename~)
set splitbelow                          " place new files below the current
set clipboard+=unnamed                  " yank and copy to X clipboard
set encoding=utf-8                      " UTF-8 encoding for all new files
set termencoding=utf-8                  " Default encoding
set scrolloff=10                        " keep 10 lines of context
set number                              " show line numbers
set ww=b,s,h,l,<,>,[,]                  " whichwrap -- left/right keys can traverse up/down
set linebreak                           " attempt to wrap lines cleanly
set wildmode=list:longest,full          " full completion options
set lazyredraw                          " redraw only when need to, this was the biggest bottleneck when scrolling in 1500+ lines long files
set nostartofline                       " Don't move the cursor while using CTRL-D or CTRL-B
set confirm                             " Don't quit silently when there are unsaved changes
set shell=zsh                           " Use this POSIX-compliant shell
set fileformats="unix,dos,mac"          " Specify the file formats to be tried when a file is read
set noesckeys
set timeoutlen=500                      " Decrease the time in ms. for mapped key sequence to complete
set ttimeoutlen=50                      " Same as the above one
set timeout                             " These two have lengthy explanation, refer to :help timeout
set ttimeout
set autoread                            " Automatically read a file that has been changed outside of vim
set modelines=0                         " see https://lists.alioth.debian.org/pipermail/pkg-vim-maintainers/2007-June/004020.html
set nomodeline                          " Same as the above one

" undo, swap files, viminfo
set history=1000                        " The number of lines to remember
let &viminfo="'50,s100,!,r/tmp,r/mnt,r/media,n" . vimfiles . "/viminfo"
set undolevels=5000                     " The number of changes to be undone
set undofile
let &undodir=vimfiles . '/undo'         " Persistent undo file to easily rollback any changes at any time
let &dir=vimfiles . '/tmp'              " Write the swap files here

" tabs and indenting
set tabstop=4                           " tabs appear as n number of columns
set shiftwidth=4                        " n cols for auto-indenting
set expandtab                           " spaces instead of tabs
set smarttab                            " use tabs for indentation and spaces for alignment
set autoindent                          " auto indents next new line
set copyindent                          " copy the previous indentation (if any)
set backspace=2                         " full backspacing capabilities (indent,eol,start)

" searching
set hlsearch                            " highlight all search results
set incsearch                           " increment search
set ignorecase                          " case-insensitive search
set smartcase                           " uppercase causes case-sensitive search
set showmatch                           " matching brackets & the like

" mute the donkey
set noerrorbells
set t_vb=
"set visualbell

" listchars
set listchars=trail:·,precedes:«,extends:»,eol:↲,tab:▸\ 

" status bar info and appearance
set statusline=\ \%f%m%r%h%w\ ::\ %y\ [%{&ff}]\%=\ [%p%%:\ %l/%L]\ 
set laststatus=2
set cmdheight=1

let g:is_posix=1                        " POSIX shell scripts
let g:loaded_matchparen=1               " disable parenthesis hlight plugin
let g:is_bash=1                         " bash syntax the default for hlighting
let g:vimsyn_noerror=1                  " hack for correct syntax hlighting
let g:airline_powerline_fonts=1         " populate patched air/powerline fonts
let g:airline#extensions#tabline#tab_nr_type=1 " show the tab number
let g:rainbow_active=1                  " The coders plugin - https://github.com/luochen1990/rainbow

" netrw, the built-in NERDTree
let g:netrw_liststyle=3                 " tree style listing
let g:netrw_home=vimfiles               " Store the .netrwhist file here
let g:netrw_banner=0                    " Who likes ads, banners ?
let g:netrw_silent=1                    " Silent file transfer
"let g:netrw_browse_split=3              " Open the selected file in a new tab
let g:netrw_home=vimfiles               " Save the bookmarks here

" enhanced tab-completion shows all matching cmds in a popup menu (if compiled with +wildmenu)
if has("wildmenu")
    set wildmenu
    set wildmode=list:longest
    set wildignore+=*.swp,*~,*.tmp,*.bak
endif 

" disable syntax highlighting in vimdiff...
if &diff | syntax off | endif

" Restore the cursor position from previous editings
au BufReadPost * if line("'\"") > 0|if line("'\"") <= line("$")|exe("norm!  g`\"")|else|exe "norm $"|endif|endif
