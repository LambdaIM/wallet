import moment from 'moment';
import numeral from 'numeral';
const BigNumber = require('bignumber.js');

BigNumber.config({ ROUNDING_MODE: BigNumber.ROUND_DOWN });

const BlanceValue = value => {
  if (value == '' || value == undefined || value == null) {
    return '--';
  }
  var bigvalue1 = new BigNumber(value).div(1e6).toFixed(6);
  var bigvalue = new BigNumber(bigvalue1);
  return `${bigvalue.toFormat()}`;
};


const BlanceValueint = value => {
  if (value == '' || value == undefined || value == null) {
    return '--';
  }
  var bigvalue1 = new BigNumber(value).div(1e6).toFixed(2);
  var bigvalue = new BigNumber(bigvalue1);
  return `${bigvalue.toFormat()}`;
};


const TbbBlanceValue = value => {
  if (value == '' || value == undefined || value == null) {
    return '--';
  }
  // var BN = BigNumber.clone({ ROUNDING_MODE: BigNumber.ROUND_HALF_UP });
  var BN = BigNumber;
  var bigvalue1 = new BN(value).div(1e6).toFixed(6);
  var bigvalue = new BN(bigvalue1);
  return `${bigvalue.toFormat()}`;
};

const Fixed6 = value => {
  if (value == '' || value == undefined || value == null) {
    return '--';
  }
  // var BN = BigNumber.clone({ ROUNDING_MODE: BigNumber.ROUND_HALF_UP });
  var BN = BigNumber;
  var bigvalue1 = new BN(value).toFixed(6);
  var bigvalue = new BN(bigvalue1);
  return `${bigvalue.toFormat()}`;
};

const formatValue = value => {
  if (value == '' || value == undefined || value == null) {
    return '--';
  }
  var bigvalue = new BigNumber(value);

  return `${bigvalue.toFormat()} mLAMB`;
};

const Lambformat = value => {
  if (value == '' || value == undefined || value == null) {
    return '--';
  }
  var bigvalue1 = new BigNumber(value).div(1e6).toFixed(6);
  var bigvalue = new BigNumber(bigvalue1);
  return `${bigvalue.toFormat()} mLAMB`;
};
const Stoformat = value => {
  if (value == '' || value == undefined || value == null) {
    return '--';
  }
  var bigvalue1 = new BigNumber(value).div(1e6).toFixed(6);
  var bigvalue = new BigNumber(bigvalue1);

  return `${bigvalue.toFormat()} TB`;
};

const Percentformat = value => {
  if (value == '' || value == undefined || value == null) {
    return '--';
  }
  var bigvalue = new BigNumber(value);

  return `${bigvalue.div(1).times(100).toFormat(2)}%`;
};
const formatDate = value => {
  // 具体时间格式待定
  // 1 区块返回的时间
  // 2 合约返回的时间
  // 3 浏览器返回的时间
  if (value == undefined) {
    return '--';
  }
  return moment(value).utc().utcOffset(8).format('YYYY-MM-DD HH:mm:ss');
};

const blockFormatDate = value => {
  // 具体时间格式待定
  // 1 区块返回的时间
  // 2 合约返回的时间
  // 3 浏览器返回的时间
  if (value == undefined) {
    return '--';
  }
  return moment(value).utc().utcOffset(8).format('YYYY-MM-DD HH:mm:ss');
};

const formatStatus = value => {
  if (value == '1') {
    value = 'Success';
  } else {
    value = 'fail';
  }
  return value;
};

const formatStringToTime = s => { return moment(parseInt(s) * 1000).format('YYYY-MM-DD HH:mm:ss'); };
const formatToTime = s => {
  if (s == undefined) {
    return '--';
  }
  return moment(s).format('YYYY-MM-DD HH:mm:ss');
};

const formatSize = value => {
  return `${value} M`;
};

const formatMinerStatus = value => {
  if (value == '1') {
    value = 'Failed';
  }
  if (value == '2') {
    value = 'Success';
  }
  if (value == '0') {
    value = 'pending';
  }
  return value;
};


const readableBytes = bytes => {
  var i = Math.floor(Math.log(bytes) / Math.log(1024));
  var sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  return (bytes / Math.pow(1024, i)).toFixed(2) * 1 + ' ' + sizes[i];
};

const formatRelativeDate = value => {
  if (value == '' || value == undefined) {
    return '--';
  }
  moment.updateLocale('en', {
    relativeTime: {
      future: 'in %s',
      past: '%s ago',
      s: '%d secs',
      ss: '%d secs',
      m: 'a min',
      mm: '%d min',
      h: 'an hour',
      hh: '%d hours',
      d: 'a day',
      dd: '%d days',
      M: 'a month',
      MM: '%d months',
      y: 'a year',
      yy: '%d years'
    }
  });
  var utcnow = moment().utc().utcOffset(8).format();
  // console.log(utcnow,value);
  // return moment(value).fromNow();
  return moment(value).utc().utcOffset(8).from(utcnow);
};

function formatAmount(Amount) {
  return Amount.replace('TBB', 'TB');
}
function formatMonth(num) {
  return (num / (1000 * 1000 * 1000 * 60 * 60 * 24 * 30)).toFixed(2);
}

function formatHour(num) {
  return (num / (1000 * 1000 * 1000 * 60 * 60)).toFixed(2);
}

function denomformat(denom) {
  return denom.slice(1).toUpperCase();
}

function assertdenomformat(denom) {
  return denom.slice(1);
}
function formatDay(num) {
  return (num / (1000 * 1000 * 1000 * 60 * 60 * 24)).toFixed(2);
}

// 1000*1000*1000*60*60*24
const formatStorageSize = value => {
  console.log('formatStorageSize', value);
  if (!value) {
    return '0 TB';
  }
  let unitArr = ['TB', 'PB', 'EB', 'ZB', 'YB'];
  let index = 0;
  let srcsize = parseFloat(value);
  if (srcsize < 1) {
    return `${value} TB`;
  }
  index = Math.floor(Math.log(srcsize) / Math.log(1000));
  let size = srcsize / Math.pow(1000, index);
  size = numeral(size).format('0.[00]');
  return `${size} ${unitArr[index]}`;
};

export default {
  formatValue,
  formatDate,
  formatStatus,
  formatSize,
  formatStringToTime,
  formatMinerStatus,
  readableBytes,
  blockFormatDate,
  Lambformat,
  Percentformat,
  Stoformat,
  formatRelativeDate,
  formatAmount,
  formatToTime,
  formatMonth,
  BlanceValue,
  TbbBlanceValue,
  BlanceValueint,
  Fixed6,
  formatHour,
  denomformat,
  assertdenomformat,
  formatDay,
  formatStorageSize
};
