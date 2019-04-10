const electron = require('electron');
const app = electron.app;
const browserWindow = electron.BrowserWindow;
const path = require('path');
const url = require('url');

// Store a reference to the main window to prevent garbage collection
let mainWindow = null;

async function createWindow() {
    // TODO: Window size could be calculated based on primary display size using: https://github.com/atom/electron/blob/master/docs/api/screen.md
    mainWindow = new browserWindow({
        "title": "NGX Core",
        "width": 1024,
        "height": 768,
        "min-width": 1024,
        "min-height": 768,
        "resizable": true,
        "position": "center",
        "use-content-size": true,
        show: false
    });
    mainWindow.loadURL(url.format({
        protocol: 'file',
        pathname: path.join(__dirname, 'dist', 'ngx-core', 'index.html'),
        slashes: false
    }));
    mainWindow.webContents.openDevTools();
    mainWindow.show();
    mainWindow.focus();
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

app.on('window-all-closed', function () {
    app.quit();
});

app.on('ready', function () {
    createWindow();
});
