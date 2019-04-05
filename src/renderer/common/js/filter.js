import moment from "moment";
const BigNumber = require('bignumber.js');
BigNumber.config({ DECIMAL_PLACES: 8 })
const formatValue = (value) => {
    var bigvalue=new BigNumber(value);
    var uservalue = bigvalue.div('1e18')
    
    return `${uservalue.toFormat() } LAMB`;
}

const formatDate = (value) => {
    //浏览器的时间是utc 时间，但是时区和区块链的不一致，显示需要处理时区
    return moment(value).utc().format("YYYY-MM-DD HH:mm:ss");
}

const formatDateD = (value) => {
    //区块链上的时间 是标准utc 显示需要处理时区
    // return moment(value).utc().add(8, 'h').format("YYYY-MM-DD HH:mm:ss");
    return moment(value).utc().utcOffset(480).format("YYYY-MM-DD HH:mm:ss");
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
    formatStringToTime,
    formatDateD
}