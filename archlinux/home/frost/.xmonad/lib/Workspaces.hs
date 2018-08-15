module Workspaces where

import XMonad.Hooks.DynamicLog       -- hooks (PP*, dzenColor)
import XMonad.Util.Run (hPutStrLn)   -- utils, does what is says
import Config                        -- my module

-- iconify the current layout
myPP h = defaultPP
    { ppCurrent         = wrapDzenBlue
    , ppVisible         = wrapDzenBlue
    , ppHidden          = wrapHiddenTerm
    , ppHiddenNoWindows = wrapHiddenTerm
    , ppUrgent          = wrapDzenWhite
    , ppSep             = " "
    , ppWsSep           = lightgrayfg ++ " | "
    , ppTitle           = dzenColor (darkgray) "" -- hide window title with darker colour
    , ppLayout          = wrapDzenBrown .
    (\x -> case x of
        "Tall"                       -> wrapBitmap "tile.xbm"
        "Mirror Tall"                -> wrapBitmap "nbstack.xbm"
        "Grid"                       -> wrapBitmap "grid.xbm"
        "Spacing 5 ResizableTall"    -> wrapBitmap "tile.xbm"
        "Simple Float"               -> wrapBitmap "float.xbm"
        _ -> x
    )
    , ppOutput = hPutStrLn h
    }
    where
        wrapBitmap bitmap = lightgrayfg ++ "| " ++ bluefg ++ icondir ++ "ws/" ++ bitmap ++ ")"
        wrapDzenWhite     = dzenColor (white) (brown)
        wrapDzenBrown     = dzenColor (brown) ""
        wrapDzenBlue      = dzenColor (blue) (darkgray)
        wrapHiddenTerm    = wrapDzenBrown . hideDropdownTerm
        hideDropdownTerm ws = if ws == "NSP" then "" else ws

-- tags/workspaces
tag1   = "web"
tag2   = "dev"
tag3   = "misc"
myTags = [tag1, tag2, tag3]
