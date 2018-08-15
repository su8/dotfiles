module Config where

-- xmonad core, prompt actions
import XMonad
import XMonad.Prompt -- defaultXPConfig
-- import Data.Default -- replaces 'defaultXPConfig' with 'def'

-- default colours
brown         = "#333333"
white         = "#ffffff"
purple        = "#814da1"
purplefg      = "^fg("++ purple ++")"
darkgray      = "#222222"
darkbrown     = "#111111"
lightgray     = "#333333"
lightgrayfg   = "^fg("++ lightgray ++")"

-- dmenu configuration
mXPConfig = def
    { font                  = "xft:Terminus:size=10:antialias=true"
    , bgColor               = darkbrown
    , fgColor               = purple
    , bgHLight              = purple
    , fgHLight              = darkbrown
    , promptBorderWidth     = 0
    , position              = Bottom
    , height                = 22
    , historyFilter         = deleteConsecutive
    , historySize           = 50
    , completionKey         = xK_Tab
    }

-- icons path, dzen command to be executed, terminal
icondir = "^i(/home/frost/.xmonad/icons/"
dzenCMD = "dzen2 -ta l -x 0 -y 0 -w 220 -fn -*-dejavusans-*-r-*-*-11-*-*-*-*-*-*-* -fg "++ white ++" -bg "++ brown ++""
myTerm  = "urxvtc"
