const electron = require('electron');
const url = require('url');
const path = require('path');
const {app, BrowserWindow} = electron;

let window

app.on('ready', function() {
    window = new BrowserWindow({width: 1280, height: 720, zoomFactor: 0.8});
    window.loadURL(url.format({
        pathname: path.join(__dirname, "FrontEnd/index.html"), // local HTML import fixed.
        protocol: 'file',
        slashes: true
    }));
});

