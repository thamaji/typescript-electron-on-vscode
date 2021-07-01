import { app, BrowserWindow } from 'electron';
import * as path from 'path';

let mainWindow: Electron.BrowserWindow | null;
const createWindow = (): void => {
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      webviewTag: true
    }
  });
  mainWindow.setMenu(null);
  if (process.env['DEV_TOOLS'] == 'on') {
    mainWindow.webContents.openDevTools({
      mode: 'undocked'
    });
  }
  void mainWindow.loadFile(path.join(__dirname, 'index.html'));
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

app.on('ready', () => {
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
