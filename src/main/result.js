var log = require('../log').log;

export default function(result,state,errormsg,errorcode){
    if(errormsg!=undefined){
        log.error(errormsg); 
    }
    return {
        result:result,
        state:state,
        errorcode:errorcode,
        errormsg:errormsg instanceof Error?errormsg.message:errormsg
    }
}