import Rpcapijs from '@jswebfans/rpcapijs';
var { DAEMON_CONFIG } = require('../configmain.js');
var API;
export default function() {
  return () => {
    API = new Rpcapijs(DAEMON_CONFIG.LambdaNetwork(), 'lambda-chain-test');
    return API;
  };
}

export function changeCosmosAPI() {
  API = new Rpcapijs(DAEMON_CONFIG.LambdaNetwork(), 'lambda-chain-test');
  return true;
}

