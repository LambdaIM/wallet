import { app, BrowserWindow } from 'electron'
import { hidden } from 'ansi-colors';

import { fork } from 'child_process';

import { DAEMON_CONFIG } from "../config.js";
import { join } from "path";
import { connect } from 'net';

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
let DAEMON ;

if (process.env.NODE_ENV !== 'development') {
    global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
    DAEMON = join(__dirname, "/static/rpc-server.js");
}else{
    DAEMON = join(__dirname, "../../static/rpc-server.js");
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development' ?
    `http://localhost:9080` :
    `file://${__dirname}/index.html`


    function initRPCServer(callback) {
        let RPCServer = fork(DAEMON, [], { env: { RPC_PORT: DAEMON_CONFIG.RPC_PORT } });
        process.on('exit', () => {
          RPCServer.kill()
        });
        RPCServer.on('message', (msg) => {
          if (msg.state === 'init') {
            return callback();
          } else {
            RPCServer.removeAllListeners();
            callback(msg);
          }
        });
      }

      function maybeStartDaemon(callback) {
        const sock = connect(DAEMON_CONFIG.RPC_PORT);
      
        sock.on('connect', () => {
          sock.end()
          sock.removeAllListeners()
          callback()
        })
      
        sock.on('error', () => {
          sock.removeAllListeners()
          initRPCServer(callback)
        })
      }

function createWindow() {
    /**
     * Initial window options
     */
    mainWindow = new BrowserWindow({
        height: 676,
        useContentSize: true,
        width: 975,
        autoHideMenuBar: true,
        // resizable: true,
        // frame: false
    })

    mainWindow.loadURL(winURL)

    mainWindow.on('closed', () => {
        mainWindow = null
    })

    maybeStartDaemon(() => {
        initRPCServer((msg) => {
    
        });
    });
}

function Max() {
    mainWindow.maximize()
}



app.on('ready', () => {
    createWindow();
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow()
    }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */