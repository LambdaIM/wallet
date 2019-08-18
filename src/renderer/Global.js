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
        Vue.prototype.toBigNumStr = function (value) {
            if(value=="" || value == undefined || value == null){
                value=0;
            }
            var bigvalue=new BigNumber(value);
            return bigvalue.times(10e6).toString();
        }

        Vue.prototype.bigLess0OrGreater = function(num,GreaterNum){
            if (this.bigNum(num).isLessThanOrEqualTo(0)  || this.bigNum(num).isGreaterThan(GreaterNum)  ){
                return true
            }else{
                return false
            }
        }
        Vue.prototype.bigNumTypeFormat = function (value,type) {
            if(value=="" || value == undefined || value == null){
                value=0;
            }
            var bigvalue=new BigNumber(value).div(10e6);
            if(type=='ulamb'){
                return `${bigvalue.toFormat() } LAMB`;
            }else if(type=='ulambs'){
                return `${bigvalue.toFormat() } LAMBS`;
            }
            else if(type=='usto'){
                return `${bigvalue.toFormat() } STO`;
            }else{
                return `${bigvalue.toFormat() } ${type.substr(1).toUpperCase()}`;
            }
            
            
        }
    }
}