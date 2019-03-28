var BigInteger = require('bigi');

export default function(protoRoot,amount){    
    var BigIntMessage = protoRoot.lookupType('types.BigInt');
    var bigamount = new BigInteger(amount);
    var BigIntMessageValue = BigIntMessage.create({
          neg:1,
          abs:bigamount.toBuffer()
        })
    return BigIntMessageValue
}