
// import { signWithPrivateKey, getStoredWallet } from "@lunie/cosmos-keys"
const cosmosLib = require('@jswebfans/cosmos-lib');


export function getSigner(config, submitType = "", { address, password }) {
  // const wallet = getStoredWallet(address, password)

  var  pravteKey=cosmos.keyStore.checkJson(this.defaultwallet, password)
  var  publicKey ="";
    return signMessage => {
      const signature = signWithPrivateKey(
        signMessage,
        pravteKey
      )

      return {
        signature,
        publicKey: Buffer.from(publicKey, "base64")
      }
    }
}
