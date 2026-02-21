#Requires AutoHotkey v2.0
#SingleInstance Force

MIN_SIZE_PX := 220
global gMenu := Menu()
global PRESETS := [
    {name: "Small (800x600)", w: 800, h: 600},
    {name: "Medium (1200x800)", w: 1200, h: 800},
    {name: "Large (1600x900)", w: 1600, h: 900},
    {name: "HD (1920x1080)", w: 1920, h: 1080},
    {name: "Square (1000x1000)", w: 1000, h: 1000},
    {name: "Wide (1440x900)", w: 1440, h: 900},
    {name: "Screen Recording Window", w: 1900, h: 1100},
    {name: "Custom (2000x1000)", w: 2000, h: 1000},
    {name: "Custom (2100x1100)", w: 2100, h: 1100}
]

A_IconTip := "Global Window Resizer`nShortcut: Ctrl+Alt+R"
EnableForcedDarkTheme()

^!r::LaunchResizeMenu()

LaunchResizeMenu()
{
    targetHwnd := WinGetID("A")
    if !targetHwnd {
        return
    }

    try WinGetPos(&winX, &winY, &winW, &winH, "ahk_id " targetHwnd)
    catch {
        return
    }

    menuX := winX + Floor(winW / 2) - 80
    menuY := winY + Floor(winH / 2) - 120

    if (menuX < 0) {
        menuX := 0
    }
    if (menuY < 0) {
        menuY := 0
    }

    ShowResizeMenu(menuX, menuY, targetHwnd)
}

ShowResizeMenu(mouseX, mouseY, targetHwnd)
{
    global PRESETS, gMenu

    win := "ahk_id " targetHwnd
    if !WinExist(win) {
        return
    }

    try WinGetPos(&x, &y, &cw, &ch, win)
    catch {
        return
    }

    gMenu := Menu()
    selectedLabel := ""

    for preset in PRESETS {
        if (Abs(cw - preset.w) <= 2 && Abs(ch - preset.h) <= 2) {
            selectedLabel := preset.name
        }

        gMenu.Add(preset.name, ApplySize.Bind(targetHwnd, preset.w, preset.h))
    }

    if selectedLabel != "" {
        gMenu.Check(selectedLabel)
    }

    gMenu.Add()
    gMenu.Add("Full Screen", SetFullscreen.Bind(targetHwnd))
    gMenu.Add("Custom Size...", OpenCustomSize.Bind(targetHwnd))
    gMenu.Add("Manage Sizes...", OpenScriptForEditing)
    gMenu.Show(mouseX, mouseY)
}

ApplySize(targetHwnd, width, height, *)
{
    SetWindowSize(targetHwnd, width, height)
}

OpenCustomSize(targetHwnd, *)
{
    input := InputBox(
        "Enter size as WIDTHxHEIGHT, e.g. 1600x1000",
        "Custom Window Size",
        "w320 h140",
        "1600x1000"
    )

    if (input.Result != "OK") {
        return
    }

    if !RegExMatch(input.Value, "i)^\s*(\d{2,5})\s*[x, ]\s*(\d{2,5})\s*$", &m) {
        MsgBox("Invalid size. Use WIDTHxHEIGHT.", "Window Resizer", "Icon!")
        return
    }

    SetWindowSize(targetHwnd, Integer(m[1]), Integer(m[2]))
}

SetWindowSize(targetHwnd, width, height)
{
    global MIN_SIZE_PX

    win := "ahk_id " targetHwnd
    if !WinExist(win) {
        return
    }

    minMax := WinGetMinMax(win)
    if (minMax = 1) {
        WinRestore(win)
        Sleep(50)
    } else if (minMax = -1) {
        return
    }

    WinGetPos(&x, &y, &currentW, &currentH, win)

    newW := Max(MIN_SIZE_PX, width)
    newH := Max(MIN_SIZE_PX, height)

    centerX := x + Floor(currentW / 2)
    centerY := y + Floor(currentH / 2)
    GetMonitorWorkAreaForPoint(centerX, centerY, &left, &top, &right, &bottom)

    maxW := right - left
    maxH := bottom - top
    newW := Min(newW, maxW)
    newH := Min(newH, maxH)

    x := left + Floor((maxW - newW) / 2)
    y := top + Floor((maxH - newH) / 2)

    WinMove(x, y, newW, newH, win)
}

OpenScriptForEditing(*)
{
    Run('notepad.exe "' A_ScriptFullPath '"')
}

SetFullscreen(targetHwnd, *)
{
    win := "ahk_id " targetHwnd
    if !WinExist(win) {
        return
    }

    WinMaximize(win)
}

GetMonitorWorkAreaForPoint(px, py, &left, &top, &right, &bottom)
{
    monitorCount := MonitorGetCount()
    Loop monitorCount {
        index := A_Index
        MonitorGet(index, &mLeft, &mTop, &mRight, &mBottom)
        if (px >= mLeft && px < mRight && py >= mTop && py < mBottom) {
            MonitorGetWorkArea(index, &left, &top, &right, &bottom)
            return
        }
    }

    primary := MonitorGetPrimary()
    MonitorGetWorkArea(primary, &left, &top, &right, &bottom)
}

EnableForcedDarkTheme()
{
    static initialized := false
    if initialized {
        return
    }
    initialized := true

    ux := DllCall("GetModuleHandle", "str", "uxtheme.dll", "ptr")
    if !ux {
        ux := DllCall("LoadLibrary", "str", "uxtheme.dll", "ptr")
        if !ux {
            return
        }
    }

    ; Force dark mode for this process regardless of system theme.
    setPreferredAppMode := DllCall("GetProcAddress", "ptr", ux, "ptr", 135, "ptr")
    flushMenuThemes := DllCall("GetProcAddress", "ptr", ux, "ptr", 136, "ptr")

    if setPreferredAppMode {
        ; 2 = ForceDark.
        DllCall(setPreferredAppMode, "int", 2, "int")
    }
    if flushMenuThemes {
        DllCall(flushMenuThemes)
    }
}
