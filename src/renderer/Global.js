const BigNumber = require('bignumber.js');
BigNumber.config({ ROUNDING_MODE: BigNumber.ROUND_DOWN });

export default {
  install (Vue, options) {
    Vue.prototype.bigNum = function (value) {
      if (value == '' || value == undefined || value == null) {
        value = 0;
      }
      var bigvalue = new BigNumber(value);
      return bigvalue;
    };
    Vue.prototype.toBigNumStr = function (value) {
      if (value == '' || value == undefined || value == null) {
        value = 0;
      }
      var bigvalue = new BigNumber(value);
      return bigvalue.times(1e6).toFixed(0).toString();
    };
    Vue.prototype.toBigNumFixed = function (value) {
      if (value == '' || value == undefined || value == null) {
        value = 0;
      }
      var bigvalue = new BigNumber(value);
      return bigvalue.times(1e6).toFixed(6);
    };

    Vue.prototype.bigLess0OrGreater = function(num, GreaterNum) {
      if (this.bigNum(num).isLessThanOrEqualTo(0) || this.bigNum(num).isGreaterThan(GreaterNum)) {
        return true;
      } else {
        return false;
      }
    };
    Vue.prototype.bigNumTypeFormat = function (value, type) {
      if (value == '' || value == undefined || value == null) {
        value = 0;
      }
      var bigvalue1 = new BigNumber(value).div(1e6).toFixed(6);
      var bigvalue = new BigNumber(bigvalue1);
      if (type == 'ulamb') {
        return `${bigvalue.toFormat()} LAMB`;
      } else if (type == 'ulambs') {
        return `${bigvalue.toFormat()} LAMBS`;
      } else if (type == 'utbb') {
        return `${bigvalue.toFormat()} TBB`;
      } else {
        return `${bigvalue.toFormat()} ${type.substr(1).toUpperCase()}`;
      }
    },
    Vue.prototype.bigNumType = function (value) {
      if (value == '' || value == undefined || value == null) {
        value = 0;
      }
      var bigvalue = new BigNumber(value).div(1e6).toFixed(6);
      return bigvalue.toString();
    };

    Vue.prototype.bigNumAdd = function (value, value2) {
      if (value == undefined) {
        value = 0;
      }
      if (value2 == undefined) {
        value2 = 0;
      }
      var bigvalue = BigNumber.sum(value, value2);
      return bigvalue.toString();
    },
    Vue.prototype.CalculationMypledge = function (shares, delegator_shares, tokens) {
      console.log('CalculationMypledge');
      var BN = BigNumber.clone({ ROUNDING_MODE: BigNumber.ROUND_HALF_UP });
      var bigvalue = new BN(shares).div(delegator_shares).times(tokens);
      bigvalue = bigvalue.div(1e6).toFixed(6);
      var bigvalue2 = new BigNumber(bigvalue);
      return `${bigvalue2.toFormat()} TBB`;
    };
  }
};
