## Global Ratio Menu (Windows)

This script makes ratio resizing work across most Windows apps.

### Requirements
- AutoHotkey v2

### Run
```powershell
AutoHotkey64.exe .\global-ratio.ahk
```

### How it works
- Focus the app window you want to resize.
- Press `Ctrl+Alt+R`.
- A compact popup appears with named size presets and dimensions.
- Choose one to resize that app window.
- `Custom Size...` accepts `WIDTHxHEIGHT`.
- `Manage Sizes...` opens the script so you can edit preset entries.

### Notes
- Trigger key is currently `Ctrl+Alt+R` in `global-ratio.ahk`.
- After selecting a size, the window is centered on its current monitor.
- Resizes are instant (no animation).
- Maximized windows are restored automatically, then resized and centered.
- Minimized windows are ignored.
- Some apps with custom/non-resizable windows may ignore resize requests.
