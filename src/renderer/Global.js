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
            var bigvalue=new BigNumber(value).div(1);
            if(type=='lamb'){
                return `${bigvalue.toFormat() } LAMB`;
            }else if(type=='lambs'){
                return `${bigvalue.toFormat() } LAMBS`;
            }
            else if(type=='sto'){
                return `${bigvalue.toFormat() } STO`;
            }else{
                return `${bigvalue.toFormat() } ${type.toUpperCase()}`;
            }
            
            
        }
    }
}