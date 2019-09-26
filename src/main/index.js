import { app, BrowserWindow, Menu, net } from 'electron';

import logicrpc from './logic.js';
import upgrade from './upgrade.js';


/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
// let DAEMON ;

if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\');
}

// var log = require('../log').log;
// const settings = require('electron-settings');

// log.info('start');



global.__net = net;

let mainWindow;
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`;



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
    webPreferences: {
      nodeIntegration: true
    }
  });
  if (process.env.NODE_ENV == 'development') {
    mainWindow.webContents.openDevTools();
  }


  mainWindow.loadURL(winURL);
  // setTimeout(() => {
  //   upgrade(true);
  // }, 2000);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}



function creatMenu() {
  // Create the Application's main menu
  var template = [{
    label: 'Application',
    submenu: [
      { label: 'About Application', selector: 'orderFrontStandardAboutPanel:' },
      { label: 'New Version Detection',
        click: function() {
          upgrade(false);
        } },
      { type: 'separator' },
      { label: 'Quit', accelerator: 'Command+Q', click: function() { app.quit(); } }
    ] }, {
    label: 'Edit',
    submenu: [
      { label: 'Undo', accelerator: 'CmdOrCtrl+Z', selector: 'undo:' },
      { label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', selector: 'redo:' },
      { type: 'separator' },
      { label: 'Cut', accelerator: 'CmdOrCtrl+X', selector: 'cut:' },
      { label: 'Copy', accelerator: 'CmdOrCtrl+C', selector: 'copy:' },
      { label: 'Paste', accelerator: 'CmdOrCtrl+V', selector: 'paste:' },
      { label: 'Select All', accelerator: 'CmdOrCtrl+A', selector: 'selectAll:' }
    ] }
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

// process.on('uncaughtException', (err)=>{
//     console.log(err)
// })

app.on('ready', () => {
  createWindow();

  creatMenu();
});

app.on('window-all-closed', () => {
  // if (process.platform !== 'darwin') {
  app.quit();
  // }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

