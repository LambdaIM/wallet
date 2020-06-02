const { ipcRenderer: ipc } = require('electron-better-ipc');

async function getdata(key) {
  let res = await ipc.callMain('seting_get', {
    key: key
  });
    // console.log(res);
  if (!res.state) return;
  // console.log(res);
  return res.data;
}



async function setdata(key, value) {
  let res = await ipc.callMain('seting_set', {
    key: key,
    value: value
  });
    // console.log(res);
  if (!res.state) return;
  // console.log(res);
  return res.data;
}

export default {
  'get': getdata,
  'set': setdata
};
