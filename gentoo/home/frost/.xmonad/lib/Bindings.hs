module Bindings where

import System.Exit                     -- haskell modules
import qualified Data.Map as M         -- haskell modules
import XMonad                          -- xmonad core
import qualified XMonad.StackSet as W  -- xmonad core
import XMonad.Actions.FloatKeys        -- actions (keyResizeWindow)
import XMonad.Actions.FloatSnap        -- actions (snapMove)
import XMonad.Prompt                   -- prompt actions
import XMonad.Prompt.Shell             -- prompt actions
import Config                          -- my module
import XMonad.Util.Scratchpad          -- scratchpadSpawnActionTerminal

-- key bindings
myKeys conf@(XConfig {XMonad.modMask = modm}) = M.fromList $
    [
    -- launch dmenu
      ((modm,               xK_p     ), shellPrompt mXPConfig)
    -- close focused window
    , ((modm,               xK_c     ), kill)
     -- Rotate through the available layout algorithms
    , ((modm,               xK_space ), sendMessage NextLayout)
    --  Reset the layouts on the current workspace to default
    , ((modm .|. shiftMask, xK_space ), setLayout $ XMonad.layoutHook conf)
    -- Resize viewed windows to the correct size
    , ((modm,               xK_n     ), refresh)
    -- Move focus to the next window
    , ((modm,               xK_Tab   ), windows W.focusDown)
    -- Move focus to the next window
    , ((modm,               xK_j     ), windows W.focusDown)
    -- Move focus to the previous window
    , ((modm,               xK_k     ), windows W.focusUp  )
    -- Move focus to the master window
    , ((modm,               xK_m     ), windows W.focusMaster  )
    -- Swap the focused window and the master window
    , ((modm,               xK_Return), windows W.swapMaster)
    -- Swap the focused window with the next window
    , ((modm .|. shiftMask, xK_j     ), windows W.swapDown  )
    -- Swap the focused window with the previous window
    , ((modm .|. shiftMask, xK_k     ), windows W.swapUp    )
    -- Shrink the master area
    , ((modm,               xK_h     ), sendMessage Shrink)
    -- Expand the master area
    , ((modm,               xK_l     ), sendMessage Expand)
    -- Push all windows in the current workspace/tag back into tiling (press alt+t and cycle between different layouts to see it in action. It's also useful for floating layout where other windows are stealing focus
    , ((modm,               xK_t     ), gets (M.keys . W.floating . windowset) >>= mapM_ (windows . W.sink))
    -- Increment the number of windows in the master area
    , ((modm              , xK_comma ), sendMessage (IncMasterN 1))
    -- Deincrement the number of windows in the master area
    , ((modm              , xK_period), sendMessage (IncMasterN (-1)))
    -- Quit xmonad
    , ((modm .|. shiftMask, xK_q     ), io (exitWith ExitSuccess))
    -- Restart xmonad
    , ((modm              , xK_q     ), spawn "xmonad --recompile; xmonad --restart")




    -- User defined actions

    -- move window to the right, left, up, down
    , ((modm,                 xK_KP_Left   ), withFocused $ snapMove L Nothing)
    , ((modm,                 xK_KP_Right  ), withFocused $ snapMove R Nothing)
    , ((modm,                 xK_KP_Up     ), withFocused $ snapMove U Nothing)
    , ((modm,                 xK_KP_Down   ), withFocused $ snapMove D Nothing)
    , ((modm,                 xK_KP_End    ), withFocused (keysMoveWindowTo (1355,1075) (0,1))) -- position my (floating) terminal window in the bottom right corner (browser to the left, terminal to the right)

    , ((modm,   xK_Left   ), withFocused (keysMoveWindow (-50,0)))
    , ((modm,   xK_Right  ), withFocused (keysMoveWindow (50,0)))
    , ((modm,   xK_Up     ), withFocused (keysMoveWindow (0,-50)))
    , ((modm,   xK_Down   ), withFocused (keysMoveWindow (0,50)))



    -- dynamic window resizing, no matter what layout is used
    , ((modm .|. shiftMask,   xK_Left   ), withFocused (keysResizeWindow (-50,0) (0,0)))
    , ((modm .|. shiftMask,   xK_Right  ), withFocused (keysResizeWindow (50,0) (0,0)))
    , ((modm .|. shiftMask,   xK_Up     ), withFocused (keysResizeWindow (0,-50) (0,0)))
    , ((modm .|. shiftMask,   xK_Down   ), withFocused (keysResizeWindow (0,50) (0,0)))



    -- User defined commands

    , ((mod4Mask          , xK_x        ), spawn myTerm)
    , ((mod4Mask          , xK_z        ), scratchpadSpawnActionTerminal myTerm)
    , ((mod4Mask          , xK_t        ), spawn "thunar")
    , ((mod4Mask          , xK_f        ), spawn "chromium")
    , ((mod4Mask          , xK_s        ), spawn "tor-browser-en --dir=/tmp")
    , ((mod4Mask          , xK_q        ), spawn "qbittorrent")
    , ((modm              , xK_Print    ), spawn "scrot")

    ]
    ++

    --
    -- mod-[1..9], Switch to workspace N
    -- mod-shift-[1..9], Move client to workspace N
    --
    [((m .|. modm, k), windows $ f i)
        | (i, k) <- zip (XMonad.workspaces conf) [xK_1 .. xK_9]
        , (f, m) <- [(W.greedyView, 0), (W.shift, shiftMask)]]
    ++

    --
    -- mod-{w,e,r}, Switch to physical/Xinerama screens 1, 2, or 3
    -- mod-shift-{w,e,r}, Move client to screen 1, 2, or 3
    --
    [((m .|. modm, key), screenWorkspace sc >>= flip whenJust (windows . f))
        | (key, sc) <- zip [xK_w, xK_e, xK_r] [0..]
        , (f, m) <- [(W.view, 0), (W.shift, shiftMask)]]

-- Mouse bindings
myMouseBindings (XConfig {XMonad.modMask = modm}) = M.fromList $
    -- mod-button1, Set the window to floating mode and move by dragging
    [ ((modm, button1), (\w -> focus w >> mouseMoveWindow w
                                       >> windows W.shiftMaster))
    -- mod-button2, Raise the window to the top of the stack
    , ((modm, button2), (\w -> focus w >> windows W.shiftMaster))
    -- mod-button3, Set the window to floating mode and resize by dragging
    , ((modm, button3), (\w -> focus w >> mouseResizeWindow w
                                       >> windows W.shiftMaster))
    ]
