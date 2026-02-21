const path = require("path");
const { app, BrowserWindow, ipcMain, screen } = require("electron");

function clampSizeToDisplay(width, height, workArea) {
  let nextWidth = width;
  let nextHeight = height;

  if (nextWidth > workArea.width) {
    nextWidth = workArea.width;
  }
  if (nextHeight > workArea.height) {
    nextHeight = workArea.height;
  }

  return [nextWidth, nextHeight];
}

function createWindow() {
  const win = new BrowserWindow({
    width: 420,
    height: 740,
    minWidth: 220,
    minHeight: 220,
    autoHideMenuBar: true,
    backgroundColor: "#0f1115",
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.loadFile(path.join(__dirname, "index.html"));
}

ipcMain.handle("set-window-ratio", (_, ratio) => {
  const focusedWindow = BrowserWindow.getFocusedWindow();
  if (!focusedWindow || typeof ratio !== "string") {
    return false;
  }

  const [ratioWidth, ratioHeight] = ratio.split(":").map(Number);
  if (!ratioWidth || !ratioHeight) {
    return false;
  }

  const targetRatio = ratioWidth / ratioHeight;
  const [currentWidth, currentHeight] = focusedWindow.getSize();
  const display = screen.getDisplayMatching(focusedWindow.getBounds());

  let nextWidth = Math.round(currentHeight * targetRatio);
  let nextHeight = currentHeight;

  [nextWidth, nextHeight] = clampSizeToDisplay(
    nextWidth,
    nextHeight,
    display.workAreaSize
  );

  // If clamping width changed the ratio too much, recalculate height from width.
  nextHeight = Math.round(nextWidth / targetRatio);
  if (nextHeight > display.workAreaSize.height) {
    nextHeight = display.workAreaSize.height;
    nextWidth = Math.round(nextHeight * targetRatio);
  }

  focusedWindow.setAspectRatio(targetRatio);
  focusedWindow.setSize(
    Math.max(220, nextWidth),
    Math.max(220, nextHeight),
    true
  );

  // Keep window in visible work area after resize.
  focusedWindow.center();

  return true;
});

ipcMain.handle("clear-window-ratio", () => {
  const focusedWindow = BrowserWindow.getFocusedWindow();
  if (!focusedWindow) {
    return false;
  }

  focusedWindow.setAspectRatio(0);
  return true;
});

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
