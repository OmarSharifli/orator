const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("ratioApi", {
  setWindowRatio: (ratio) => ipcRenderer.invoke("set-window-ratio", ratio),
  clearWindowRatio: () => ipcRenderer.invoke("clear-window-ratio"),
});
