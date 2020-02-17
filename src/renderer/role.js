import roleconfig from '@/roleconfig.json';
const settings = require('electron-settings');

export default function(Vue) {
  Vue.directive('role', {
    // 当绑定元素插入到 DOM 中。
    bind: function (el, bingind, vnode) {
      // el.style["color"] = bingind.value;
      console.log('bind', bingind.value);
      var name = bingind.value;
      var namelist = name.split('.');

      var roledata = null;
      namelist.forEach(function(item) {
        if (item != '' && roledata == null) {
          roledata = roleconfig[item];
        } else {
          roledata = roledata[item];
        }
      });


      var role = settings.get('userrole') || null;

      var result = false;

      if (roledata instanceof Array) {
        result = !(roledata.indexOf(role) < 0);
      }
      if (result) {
        el.style.visibility = 'visible';
      } else {
        el.style.visibility = 'hidden';
      }
    },
    update: function(el, bingind, vnode) {
      console.log('update', bingind.value);
      var name = bingind.value;
      var namelist = name.split('.');

      var roledata = null;
      namelist.forEach(function(item) {
        if (item != '' && roledata == null) {
          roledata = roleconfig[item];
        } else {
          roledata = roledata[item];
        }
      });


      var role = settings.get('userrole') || null;

      var result = false;

      if (roledata instanceof Array) {
        result = !(roledata.indexOf(role) < 0);
      }
      if (result) {
        el.style.visibility = 'visible';
      } else {
        el.style.visibility = 'hidden';
      }
    }
  });
}
