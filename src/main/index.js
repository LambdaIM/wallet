import { app, BrowserWindow, Menu  } from 'electron'
import { hidden } from 'ansi-colors';

import { fork } from 'child_process';
import { DAEMON_CONFIG } from "../config.js";
import { join } from "path";
import { connect } from 'net';




import logicrpc from './logic.js';

// var log = require('../log').log;
// const settings = require('electron-settings');

// log.info('start');


/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
// let DAEMON ;

// if (process.env.NODE_ENV !== 'development') {
//     global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
    
//     DAEMON = join(__dirname, "/static/rpc-server.js");
// }else{
//     DAEMON = join(__dirname, "../../static/rpc-server.js");
// }

let mainWindow
const winURL = process.env.NODE_ENV === 'development' ?
    `http://localhost:9080` :
    `file://${__dirname}/index.html`


    

function createWindow() {
    /**
     * Initial window options
     */
    logicrpc();
    mainWindow = new BrowserWindow({
        height: 676,
        useContentSize: true,
        width: 975,
        autoHideMenuBar: true,
        // title:'lamb wallet',
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

    
    
    
}

function Max() {
    mainWindow.maximize()
}


function creatSeting(){
    
    // if(settings.has('user.node')==false){
    //     //http://18.136.176.184:13657/abci_query
    //     settings.set('user', {
    //         node: 'http://18.136.176.184:13657/'
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

