var log = require('../log').log;
const settings = require('electron-settings');

export default function(){
    console.log('defaultwallet', settings.get('defaultwallet'));
    if (settings.has('defaultwallet') != undefined) {
        return settings.get('defaultwallet')
    }else{
      throw new Error('no default wallet')
    }
  }