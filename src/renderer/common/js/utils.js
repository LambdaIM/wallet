const BigNumber = require('bignumber.js');
BigNumber.config({ DECIMAL_PLACES: 8,EXPONENTIAL_AT: 1e+9 })

// Almost never return exponential notation:
// BigNumber.config({ EXPONENTIAL_AT: 1e+9 })


const numberToBig = (value) => {
    var bigvalue = new BigNumber(String(value)+'e18')
    return bigvalue.toString();
}


const bigToNumber = (value) => {
    var bigvalue=new BigNumber(String(value));
    var uservalue = bigvalue.div('1e18')
    
    return uservalue.toNumber()    ;
}

export default {
    numberToBig,
    bigToNumber
}