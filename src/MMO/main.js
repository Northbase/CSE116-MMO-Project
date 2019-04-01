const electron = require('electron');
const url = require('url');
const path = require('path');
const {app, BrowserWindow} = electron;

let window;

app.on('ready', function() {
    window = new BrowserWindow({
        width: 1280,
        height: 720,
        zoom: 0.8,
        frame: false,
        setFullScreen: true
    });
    window.loadURL(url.format({
        pathname: path.join(__dirname, "FrontEnd/index.html"),
        protocol: 'file',
        slashes: true
    }));
});

