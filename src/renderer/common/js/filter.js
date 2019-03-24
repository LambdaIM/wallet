import moment from "moment";
const BigNumber = require('bignumber.js');
BigNumber.config({ DECIMAL_PLACES: 8 })
const formatValue = (value) => {
    var bigvalue=new BigNumber(value);
    var uservalue = bigvalue.div('1e18')
    
    return `${uservalue.toFormat() } LAMB`;
}

const formatDate = (value) => {
    return moment(value).utc().format("YYYY-MM-DD HH:mm:ss");
}

const formatDateD = (value) => {
    return moment(value).utc().add(8, 'h').format("YYYY-MM-DD HH:mm:ss");
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