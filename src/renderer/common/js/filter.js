import moment from "moment";
const BigNumber = require('bignumber.js');
BigNumber.config({ROUNDING_MODE: BigNumber.ROUND_DOWN })


const formatValue = (value) => {
    if(value=="" || value == undefined || value == null){
        return '--'
    }
    var bigvalue=new BigNumber(value);
    
    return `${bigvalue.toFormat() } LAMB`;
}

const Lambformat = (value) => {
    if(value=="" || value == undefined || value == null){
        return '--'
    }
    var bigvalue1=new BigNumber(value).div(1e6).toFixed(6) ;
    var bigvalue=new BigNumber(bigvalue1) ;
    return `${bigvalue.toFormat() } LAMB`;
}
const Stoformat = (value) => {
    if(value=="" || value == undefined || value == null){
        return '--'
    }
    var bigvalue1=new BigNumber(value).div(1e6).toFixed(6) ;
    var bigvalue=new BigNumber(bigvalue1);
    
    return `${bigvalue.toFormat() } STO`;
}

const Percentformat = (value) => {
    if(value=="" || value == undefined || value == null){
        return '--'
    }
    var bigvalue=new BigNumber(value);
    
    return `${bigvalue.div(1).times(100).toFormat() }%`;
}
const formatDate = (value) => {
    //具体时间格式待定 
    //1 区块返回的时间
    //2 合约返回的时间
    //3 浏览器返回的时间
    if(value==undefined){
        return '--'
    }
    return moment(value).utc().utcOffset(8).format("YYYY-MM-DD HH:mm:ss");
}

const blockFormatDate = (value) => {
    //具体时间格式待定 
    //1 区块返回的时间
    //2 合约返回的时间
    //3 浏览器返回的时间
    if(value==undefined){
        return '--'
    }
    return moment(value).utc().utcOffset(8).format("YYYY-MM-DD HH:mm:ss");
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

const formatMinerStatus = (value) => {
    if (value == "1") {
    value = "Failed"
    }
    if (value == "2") {
    value = "Success"
    }
    if (value == "0") {
    value = "pending"
    }
    return value;
}


const  readableBytes =(bytes)=> {
    var i = Math.floor(Math.log(bytes) / Math.log(1024)),
    sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    return (bytes / Math.pow(1024, i)).toFixed(2) * 1 + ' ' + sizes[i];
}

const formatRelativeDate = (value) => {
    if (value == '' || value == undefined) {
        return '--'
    }
    moment.updateLocale('en', {
        relativeTime : {
            future: "in %s",
            past:   "%s ago",
            s  : '%d secs',
            ss : '%d secs',
            m:  "a min",
            mm: "%d min",
            h:  "an hour",
            hh: "%d hours",
            d:  "a day",
            dd: "%d days",
            M:  "a month",
            MM: "%d months",
            y:  "a year",
            yy: "%d years"
        }
    });
    var utcnow = moment().utc().utcOffset(8).format();
    // console.log(utcnow,value);
    // return moment(value).fromNow();
    return moment(value).utc().utcOffset(8).from(utcnow);
}


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
    formatRelativeDate
}