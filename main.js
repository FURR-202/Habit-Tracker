const { app, BrowserWindow } = require('electron');
const path = require('path');
function createWindow() {
  // Create a browser window
  const win = new BrowserWindow({
    width: 700,
    height: 500,
    webPreferences: {
      nodeIntegration: true, // Allows renderer process to use Node.js APIs
      contextIsolation: false, // Required for nodeIntegration to work
    },
  });

  // Load the index.html file from the inner folder
  win.loadFile('index.html');
  // win.webContents.openDevTools(); // Open DevTools for debugging

}

// When Electron is ready, create the window
app.whenReady().then(createWindow);

// Quit the app when all windows are closed (except on macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Re-create a window when the app is activated (macOS behavior)
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});