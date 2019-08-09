import Cosmos from "@lunie/cosmos-api"
// import config from "src/config"
// import { getSigner } from "./signer"
import transaction from "./transactionTypes"

var  config ={};

export default class ActionManager {
  constructor() {
    this.context = null
    this.cosmos = null
    this.message = null
  }

  setContext(context = null) {
    if (!context) {
      throw Error("Context cannot be empty")
    }
    this.context = context
    this.cosmos = new Cosmos(this.context.url || "", this.context.chainId || "")
  }

  readyCheck() {
    if (!this.context) {
      throw Error("This modal has no context.")
    }

    if (!this.context.connected) {
      throw Error(
        `Currently not connected to a secure node. Please try again when Lunie has secured a connection.`
      )
    }

    if (!this.message) {
      throw Error(`No message to send.`)
    }
  }

  messageTypeCheck(msgType) {
    if (!msgType) {
      throw Error("No message type present.")
    }

    const isKnownType = Object.values(transaction).includes(msgType)
    if (!isKnownType) {
      throw Error(`Invalid message type: ${msgType}.`)
    }
  }

  setMessage(type, transactionProperties) {
    if (!this.context) {
      throw Error("This modal has no context.")
    }

    this.messageTypeCheck(type)
    this.messageType = type
    this.message = this.cosmos[type](
      this.context.userAddress,
      transactionProperties
    )
  }

  async simulate(memo) {
    // this.readyCheck()
    const gasEstimate = await this.message.simulate({
      memo: memo
    })
    return gasEstimate
  }

  async send(memo, txMetaData,signerFn) {
    // this.readyCheck()

    const { gasEstimate, gasPrice, submitType, password } = txMetaData
    // const signer = getSigner(config, submitType, {
    //   address: this.context.userAddress,
    //   password
    // })

    if (this.messageType === transaction.WITHDRAW) {
      this.message = await this.createWithdrawTransaction()
    }
    
    const { included, hash } = await this.message.send(
      {
        gas: String(gasEstimate),
        gasPrices: convertCurrencyData([gasPrice]),
        memo
      },
      signerFn
    )

    return { included, hash }
  }

 async createWithdrawTransaction() {
    const addresses = await getTop5RewardsValidators(this.context.userAddress,this.cosmos)
    return this.createMultiMessage(
      transaction.WITHDRAW,
      this.context.userAddress,
      { validatorAddresses: addresses }
    )
  }

  // Withdrawing is a multi message for all validators you have bonds with
  createMultiMessage(type, senderAddress, { validatorAddresses }) {
    const messages = validatorAddresses.map(validatorAddress =>
      this.cosmos[type](senderAddress, { validatorAddress })
    )
    return this.cosmos.MultiMessage(senderAddress, messages)
  }
}

function convertCurrencyData(amounts) {
  return amounts.map(({ amount, denom }) => ({
    amount: toMicroAtomString(amount),
    denom
  }))
}

function toMicroAtomString(amount) {
  return String(amount)
  // return String(uatoms(amount))
}

// // limitation of the block, so we pick the top 5 rewards and inform the user.
async function getTop5RewardsValidators(operator_address,cosmos) {
  // Compares the amount in a [address1, {denom: amount}] array
  //1 获取我的质押列表
  //2 获取我的收益列表
  //3 选择前5条数据 因为出块大小限制
  console.log('this.context.userAddress')
  
  // return;
  var delegationsList = await  cosmos.get.delegations(operator_address);
   delegationsList.forEach(async (item)=>{
    var Rewards =await  cosmos.get.delegatorRewardsFromValidator(operator_address,item.validator_address);
    item.Rewards=coinListFormart(Rewards);
  })

  const byBalanceOfDenom = denom => (a, b) => b.Rewards - a.Rewards
  const validatorList = delegationsList
    .sort(byBalanceOfDenom)
    .slice(0, 5) // Just the top 5
    .map((item) => item.validator_address)
    console.log(validatorList)
    console.log('this.context.userAddress')
  return validatorList
}


function coinListFormart(list){
  var result =0
  list.forEach((item)=>{
    if(item.denom=='lamb'){
      result = item.amount
    }
    result.push(item.amount+item.denom)
  })
  return result

}