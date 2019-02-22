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
    if (/^[0-9a-f]{40}$/.test(address) || /^[0-9A-F]{40}$/.test(address)) {
        return true;
        // Otherwise check each case
    } else {
        return false;
    }
}







