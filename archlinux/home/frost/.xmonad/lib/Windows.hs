module Windows where

import XMonad hiding ( (|||) )         -- xmonad core
import qualified XMonad.StackSet as W  -- xmonad core
import XMonad.Hooks.ManageHelpers      -- hooks (doCenterFloat)
import XMonad.Util.Scratchpad          -- scratchpadManageHook
import Workspaces                      -- my module
import Config                          -- my module

-- window rules
myManageHook = composeAll . concat $
    [ [isDialog        --> doCenterFloat'                ]    -- Dont hide the dialogues behind their parent
    , [className  =? c --> doFloat       | c <- myJFloats]    -- Just float
    , [className  =? c --> doCenterFloat' | c <- myCFloats]   -- Center float
    , [title      =? t --> doFloat       | t <- myTFloats]
    , [resource   =? r --> doFloat       | r <- myRFloats]
    , [resource   =? i --> doIgnore      | i <- myIgnores]
    , [(className =? x <||> title =? x <||> resource =? x) --> doShift tag1 | x <- my1Shifts]        -- send the given program to this tag
    , [(className =? x <||> title =? x <||> resource =? x) --> doShiftAndGo tag3 | x <- my3Shifts]  -- send the given program to this tag
    ]
    where
        doMaster  = doF W.shiftMaster -- new floating windows goes on top
        doCenterFloat' = doCenterFloat <+> doMaster
        doShiftAndGo ws = doF (W.greedyView ws) <+> doShift ws
        myJFloats = ["Tor Browser"]
        myCFloats = ["Vlc", "Thunar", "Wine", "Qbittorrent", "Sxiv"] -- press alt+t to switch the floating layout with other
        myTFloats = []
        myRFloats = []
        myIgnores = ["xmobar","dzen","dzen2","desktop_window","kdesktop"]
        my1Shifts = ["Tor Browser"]
        my3Shifts = ["Qbittorrent", "Wine", "Gimp-2.8", "Gimp"]

-- mimic G/Quake
dropdownTerminal = scratchpadManageHook(W.RationalRect l t w h)
    where
        h = 0.4       -- terminal height 40%
        w = 0.5       -- terminal width 50%
        t = 0.015     -- distance from top edge 1.5%
        l = 0.25      -- distance from left edge 25%
