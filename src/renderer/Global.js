const BigNumber = require('bignumber.js');
BigNumber.config({ DECIMAL_PLACES: 8,ROUNDING_MODE: BigNumber.ROUND_DOWN })

export default {
    install (Vue, options) {
        Vue.prototype.bigNum = function (value) {
            if(value=="" || value == undefined || value == null){
                value=0;
            }
            var bigvalue=new BigNumber(value);
            return bigvalue;
        }
    }
}