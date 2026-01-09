const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

let mainWindow = null;
let outputWindow = null;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    title: 'HawkTimer Pro',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  mainWindow.loadFile('index.html');

  mainWindow.on('closed', () => {
    mainWindow = null;
    if (outputWindow) {
      outputWindow.close();
    }
  });
}

function createOutputWindow() {
  if (outputWindow) {
    outputWindow.focus();
    return;
  }

  outputWindow = new BrowserWindow({
    width: 800,
    height: 600,
    title: 'HawkTimer Pro - Output',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  outputWindow.loadFile('viewer.html');

  outputWindow.on('closed', () => {
    outputWindow = null;
  });
}

// Create application menu
const menuTemplate = [
  {
    label: 'HawkTimer Pro',
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      { role: 'services' },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideOthers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' }
    ]
  },
  {
    label: 'File',
    submenu: [
      {
        label: 'New Output Window',
        accelerator: 'CmdOrCtrl+N',
        click: createOutputWindow
      },
      { type: 'separator' },
      { role: 'close' }
    ]
  },
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      { role: 'selectAll' }
    ]
  },
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forceReload' },
      { type: 'separator' },
      { role: 'resetZoom' },
      { role: 'zoomIn' },
      { role: 'zoomOut' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  },
  {
    label: 'Window',
    submenu: [
      { role: 'minimize' },
      { role: 'zoom' },
      { type: 'separator' },
      { role: 'front' }
    ]
  }
];

app.whenReady().then(() => {
  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);

  createMainWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
