
// import { signWithPrivateKey, getStoredWallet } from "@lunie/cosmos-keys"
const cosmosLib = require('@jswebfans/cosmos-lib');


export function getSigner(config, submitType = "", { address, password }) {
  // const wallet = getStoredWallet(address, password)
  
  var  privatekey=cosmos.keyStore.checkJson(this.defaultwallet, password)
  var  publicKey ="";
    return signMessage => {
      const signature = signWithPrivateKey(
        signMessage,
        privatekey
      )

      return {
        signature,
        publicKey: Buffer.from(publicKey, "base64")
      }
    }
}
