import moment from "moment";
const formatValue = (value) => {
    return `${value / 10000} LAMB`;
}

const formatDate = (value) => {
    return moment(value).format("YYYY-MM-DD HH:mm:ss");
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