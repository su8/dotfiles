-- xmonad core
import XMonad hiding ( (|||) )
import Data.Monoid                               -- mempty
-- import Data.Default                              -- replaces 'defaultConfig' with 'def'

-- hooks
import XMonad.Hooks.SetWMName                    -- EWMH
import XMonad.Hooks.EwmhDesktops                 -- EWMH
import XMonad.Hooks.ManageDocks                  -- avoidStruts
import XMonad.Hooks.DynamicLog                   -- dynamicLogWithPP

-- layouts
import XMonad.Layout.PerWorkspace (onWorkspace)  -- diff. tag diff. layout
import XMonad.Layout.LayoutCombinators           -- ||, managehooks
import XMonad.Layout.Grid                        -- grid layout
import XMonad.Layout.Spacing                     -- spacing
import XMonad.Layout.ResizableTile               -- ResizableTall
import XMonad.Layout.SimpleFloat                 -- simpleFloat, floating layout

-- utils
import XMonad.Util.Run (spawnPipe)               -- does what is says
import XMonad.Util.Cursor                        -- setDefaultCursor

-- my lib/modules.hs
import Config
import Windows
import Bindings
import Workspaces

-- XMonad
main = do
    panel <- spawnPipe dzenCMD
    xmonad $ def           { terminal  = myTerm,          -- terminal client
        focusFollowsMouse  = True,                        -- focus follows the mouse pointer
        clickJustFocuses   = False,                       -- Whether clicking on a window to focus also passes the click to the window
        borderWidth        = 1,                           -- Width of the window border in pixels.
        modMask            = mod1Mask,                    -- left alt to do all the heavy work
        workspaces         = myTags,                      -- number of tags/workspaces
        normalBorderColor  = brown,                       -- unfocused border colour
        focusedBorderColor = purple,                      -- focused border colour

        -- key bindings
        keys               = myKeys,
        mouseBindings      = myMouseBindings,

        -- hooks, layouts
        layoutHook         = myLayout,
        manageHook         = manageDocks <+> myManageHook <+> dropdownTerminal <+> manageHook def,
        handleEventHook    = mempty,
        logHook            = dynamicLogWithPP $ myPP panel,
        startupHook        = setDefaultCursor xC_left_ptr <+>  ewmhDesktopsStartup >> setWMName "Xmonad"
    }


-- layouts
myLayout =
    avoidStrutsOn [U] -- avoid statusbar overlapping
        $ onWorkspace tag1 floaT
        $ onWorkspace tag2 tiled
        $ standardLayouts
    where
        standardLayouts = tiled ||| mtiled ||| Grid ||| floaT
        floaT   = simpleFloat
        tiled1  = Tall nmaster delta ratio
        mtiled  = Mirror tiled1
        tiled   = spacing 5 $ ResizableTall nmaster delta ratio []
        nmaster = 1       -- The default number of windows in the master pane
        ratio   = 1/2     -- Default proportion of screen occupied by master pane
        delta   = 3/100   -- Percent of screen to increment by when resizing panes
