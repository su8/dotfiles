#---------------------------------------------
# My blog stuff
#---------------------------------------------
blog() {

  local doc_dir="$HOME/Documents"
  local blog_dir="${doc_dir}/blog"
  local blog_tar="blog.tar"

  cd "${blog_dir}"

  case $1 in
    gen) python2 generate.py                 ;;
    git) cd "generated" ; git add -A ; git commit -am "blog" ; git push ;;
    tar) cd .. ; rm -rf "${blog_tar}" ; compresstar "blog" ;
           cpr "${blog_tar}" "mega-drive/"   ;;
    op*) python2 generate.py --optimize      ;;
    re*) python2 generate.py --replace $2 $3 ;;
    po*) python2 generate.py --new $2        ;;
    fo*) python2 generate.py --format $2     ;;
    *)
  esac

}