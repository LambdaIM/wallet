const bech32 = require(`bech32`)

export default  (address) => {
    // check if it has the basic requirements of an address
     if (checkAddress(address)) {
        return true;
        // Otherwise check each case
    } else {
        var addressL=address.toLocaleLowerCase();
        return checkAddress(addressL);
    }
};


function checkAddress(address){
    var result;
    try{
        const words = bech32.decode(address)
         Buffer.from(bech32.fromWords(words.words)).toString(`hex`)
         result=true;
    }
    catch(ex){
        result=false;
    }
    return result;
    // if (/^[0-9a-f]{40}$/.test(address) || /^[0-9A-F]{40}$/.test(address)) {
    //     return true;
    //     // Otherwise check each case
    // } else {
    //     return false;
    // }
}







