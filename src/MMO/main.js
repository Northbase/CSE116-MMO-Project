const electron = require('electron');
const { protocol }  = require('electron');
const url = require('url');
const path = require('path');
const {app, BrowserWindow} = electron;
let window;

// let {PythonShell} = require('python-shell');
// PythonShell.run('Server/TCPclient.py',  function  (err, results)  {
//     if  (err) throw (err);
// });

function createWindow() {
    window = new BrowserWindow({
          width: 1280,
        height: 720,
        zoom: 0.8,
        frame: false,
        setFullScreen: true,
    });
    window.webContents.openDevTools();

    window.loadURL(url.format({
        pathname: path.join(__dirname, "FrontEnd/templates/index.html"),
        protocol: 'file',
        slashes: true
    }));
    // window.loadURL(url.format({
    //     pathname: path.join(__dirname, "FrontEnd/templates/game.html"),
    //     protocol: 'file',
    //     slashes: true
    // }));
    // window.loadURL(url.format({
    //     pathname: path.join(__dirname, "Server/TCPclient.py"),
    //     protocol: 'file',
    //     slashes: true
    // }));
}


app.on('ready', function() {
    // var python = require('child_process').spawn('python', ['Server/TCPclient.py']);
    // protocol.interceptFileProtocol('file', (request, callback) => {
    //     const url = request.url.substr(7);    /* all urls start with 'file://' */
    //     callback({ path: path.normalize(`${__dirname}/${url}`) })
    // }, (err) => {
    //     if (err) console.error('Failed to register protocol')
    // });
    let python = require('child_process').spawn('python', ['Server/TCPclient.py']);
    // let scala = require('child_process').spawn('scala', ['Server/TCPserver.server']);

    // let {PythonShell} = require('python-shell');
    // PythonShell.run('Server/TCPclient.py',  function  (err, results)  {
    //     if  (err) throw (err);
    // });

    createWindow();
});

