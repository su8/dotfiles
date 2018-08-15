#!/usr/bin/env bash

# Copyright 07/05/2016 https://github.com/wifiextender

# This program is free software; you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation; either version 2 of the License, or
# (at your option) any later version.

# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.

# You should have received a copy of the GNU General Public License
# along with this program; if not, write to the Free Software
# Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
# MA 02110-1301, USA.

# Relying on `git' makes life easier
# also git `submodules' are not n00b friendly

update() {
  _bundle="bundle/${1##*/}"
  [[ ! -d "${_bundle}" ]] && git clone --depth 1 "${1}" "${_bundle}"

  cd "${_bundle}"
  git fetch --all
  git reset --hard   # undo any changes
  git pull origin master
  cd ../..
}

main() {
  # dwm.vim is customized, dont override
  declare -a _repos=(
    'https://github.com/vim-airline/vim-airline'
    'https://github.com/vim-airline/vim-airline-themes'
    'https://github.com/ctrlpvim/ctrlp.vim'
    'https://github.com/shutnik/jshint2.vim'
    'https://github.com/cohama/lexima.vim'
    'https://github.com/scrooloose/nerdtree'
    'https://github.com/shougo/neocomplete.vim'
    'https://github.com/tpope/vim-commentary'
    'https://github.com/vim-scripts/surround.vim'
    'https://github.com/tpope/vim-fugitive'
    'https://github.com/mbbill/undotree'
    'https://github.com/justinmk/vim-syntax-extra'
  )
  for x in "${_repos[@]}"
  do
    update "${x}"
  done
}

main
