var { DAEMON_CONFIG } = require('../configmain.js');
import CosmosAPI from "@jswebfans/cosmos-api"
var  API;
export default function(){
    return ()=>{
     API= new CosmosAPI(DAEMON_CONFIG.LambdaNetwork(),'lambda-hub-test')
    return API;

    }
    
}

export function changeCosmosAPI(){
    API= new CosmosAPI(DAEMON_CONFIG.LambdaNetwork(),'lambda-hub-test')
    return true;
}

