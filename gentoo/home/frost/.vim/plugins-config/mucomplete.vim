set noinfercase
set completeopt-=preview
set completeopt+=menuone,noselect
let g:clang_library_path = '/usr/lib64/llvm/6/lib64/libclang.so.6.0'
let g:clang_user_options = '-std=c99'
let g:clang_complete_auto = 1
let g:mucomplete#enable_auto_at_startup = 1
