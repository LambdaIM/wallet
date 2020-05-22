import { app, BrowserWindow, Menu, net, shell } from 'electron';



import logicrpc from './logic.js';
import upgrade from './upgrade.js';
import { connect } from 'net';
import { join } from 'path';
import { fork } from 'child_process';
import packageJson from '../../package.json';
import s3tool from './utils/s3tool';
import langmsg from './lang/index.js';

const os = require('os');
const path = require('path');
const settings = require('electron-settings');

// var { DAEMON_CONFIG } = require('../configmain.js');


/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
let DAEMON;

if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\');
  // DAEMON = join(__dirname, '/static/s3server.js');
} else {
  // DAEMON = join(__dirname, '../../static/s3server.js');
}



// var log = require('../log').log;
// const settings = require('electron-settings');

// log.info('start');

var RPC_PORT = 8379;

global.__net = net;

let mainWindow;
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`;

// function initRPCServer(callback) {
//   console.log('==initRPCServer===start');
//   let RPCServer = fork(DAEMON, [], { env: { RPC_PORT: RPC_PORT } });
//   process.on('exit', () => {
//     console.log('exit');
//     RPCServer.kill();
//   });
//   RPCServer.on('message', msg => {
//     console.log('message');
//     if (msg.state === 'init') {
//       return callback();
//     } else {
//       RPCServer.removeAllListeners();
//       callback(msg);
//     }
//   });
//   console.log('==initRPCServer===end');
// }

// function maybeStartDaemon(callback) {
//   const sock = connect(RPC_PORT);

//   sock.on('connect', () => {
//     sock.end();
//     sock.removeAllListeners();
//     callback();
//   });

//   sock.on('error', () => {
//     console.log('maybeStartDaemon error');
//     sock.removeAllListeners();
//     initRPCServer(callback);
//   });
// }

function createWindow() {
  /**
     * Initial window options
     */
  logicrpc();
  mainWindow = new BrowserWindow({
    height: 676,
    useContentSize: true,
    width: 984,
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
  var language = settings.get('set.language') || 'en';
  var objlanglist = langmsg[language] || {};


  var template = [{
    label: objlanglist['Application'],
    submenu: [
      { label: objlanglist['About_Application'], selector: 'orderFrontStandardAboutPanel:' },
      { label: objlanglist['New_Version'],
        click: function() {
          upgrade(false);
        } },
      { type: 'separator' },
      { label: objlanglist['Quit'], accelerator: 'Command+Q', click: function() { app.quit(); } }
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
    ] }, {
    label: objlanglist['Application_set'],
    submenu: [
      { label: objlanglist['config_file'],
        click: function() {
          let BASE_PATH = path.join(os.homedir(), 'lambWallet');
          shell.showItemInFolder(path.join(BASE_PATH, 'Wallet'));
        } },
      { label: objlanglist['log_file'],
        click: function() {
          let BASE_PATH = path.join(os.homedir(), 'lambWallet');
          shell.showItemInFolder(path.join(BASE_PATH, 'Log'));
        } }

    ]
  }];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

process.on('uncaughtException', err => {
  console.log(err);
});

app.on('ready', () => {
  createWindow();

  creatMenu();
});

app.on('window-all-closed', () => {
  // if (process.platform !== 'darwin') {
  s3tool.killS3();
  app.quit();
  // }
});



app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

