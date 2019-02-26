import { app, BrowserWindow, Menu  } from 'electron'
import { hidden } from 'ansi-colors';

import { fork } from 'child_process';
import { DAEMON_CONFIG } from "../config.js";
import { join } from "path";
import { connect } from 'net';



import rpc from './rpc';
import pay from './pay';

var log = require('../log').log;
const settings = require('electron-settings');

log.info('start');


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

        RPCServer.on('error', (error) => {
          log.error('error');
          initRPCServer(callback)
        })
      }

      function maybeStartDaemon(callback) {
        initRPCServer(callback)
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
        // title:'lamb wallet'
        // resizable: true,
        // frame: false
    })
    if (process.env.NODE_ENV == 'development'){
        mainWindow.webContents.openDevTools();
    }
    

    mainWindow.loadURL(winURL)

    mainWindow.on('closed', () => {
        mainWindow = null
    })

    maybeStartDaemon(() => {
        initRPCServer((msg) => {
    
        });
    });
    
    rpc();
    pay();
}

function Max() {
    mainWindow.maximize()
}


function creatSeting(){
    settings.set('user', {
        node: 'http://39.97.129.59:13657/'
      });

    // if(settings.has('user.node')==false){
    //     //http://18.136.176.184:13657/abci_query
    //     settings.set('user', {
    //         node: 'http://39.97.129.59:13657/'
    //       });

    // }
    
}

function creatMenu(){
    // Create the Application's main menu
    var template = [{
        label: "Application",
        submenu: [
            { label: "About Application", selector: "orderFrontStandardAboutPanel:" },
            { type: "separator" },
            { label: "Quit", accelerator: "Command+Q", click: function() { app.quit(); }}
        ]}, {
        label: "Edit",
        submenu: [
            { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
            { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
            { type: "separator" },
            { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
            { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
            { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
            { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
        ]}
    ];

    Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}


app.on('ready', () => {
    createWindow();
    creatSeting();
    creatMenu();
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

