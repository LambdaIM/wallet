import moment from "moment";
const BigNumber = require('bignumber.js');
BigNumber.config({ DECIMAL_PLACES: 8 })

const formatValue = (value) => {
    var bigvalue=new BigNumber(value);
    var uservalue = bigvalue.div('1e18')
    return `${uservalue.toFormat() } LAMB`;
}

const formatDate = (value) => {
    console.log(value)
    //具体时间格式待定 
    //1 区块返回的时间
    //2 合约返回的时间
    //3 浏览器返回的时间
    return moment(value).utc().utcOffset(0).format("YYYY-MM-DD HH:mm:ss");
}

const formatStatus = (value) => {
    if (value == "1") {
        value = "Success"
    } else {
        value = "fail"
    }
    return value;
}

const formatStringToTime = (s) => { return moment(parseInt(s) * 1000).format('YYYY-MM-DD HH:mm:ss') }

const formatSize = (value) =>{
    return `${value} M`
}



export default {
    formatValue,
    formatDate,
    formatStatus,
    formatSize,
    formatStringToTime
}