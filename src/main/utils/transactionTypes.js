const transactionTypes = {
  SEND: `MsgSend`,
  DELEGATE: `MsgDelegate`,
  UNDELEGATE: `MsgUndelegate`,
  REDELEGATE: `MsgBeginRedelegate`,
  SUBMIT_PROPOSAL: `MsgSubmitProposal`,
  VOTE: `MsgVote`,
  DEPOSIT: `MsgDeposit`,
  WITHDRAW: `MsgWithdrawDelegationReward`,
  AssetPledge: `MsgAssetPledge`,
  AssetDrop: `MsgAssetDrop`,
  WithdrawValidatorCommission: `MsgWithdrawValidatorCommission`,
  CreateSellOrder: `MsgCreateSellOrder`,
  CreateBuyOrder: `MsgCreateBuyOrder`,
  CreateMiner: `MsgCreateMiner`,
  CreateMachine: `MsgCreateMachine`,
  WithdrawMinerRewards: `MsgWithdrawMinerRewards`,
  OrderRenewal: `MsgOrderRenewal`,
  MinerWithDrawCount: `MsgMinerWithDrawCount`,
  DelegateMarket: 'MsgDelegateMarket',
  WithDrawMarket: 'MsgWithDrawMarket',
  CancelSellOrder: 'MsgCancelSellOrder',
  CreateDigitalAssetMarket: 'MsgCreateDigitalAssetMarket',
  DigitalAssetPledge: 'MsgDigitalAssetPledge',
  DigitalAssetRefund: 'MsgDigitalAssetRefund',
  AuthorizeMiningPubKey: 'MsgAuthorizeMiningPubKey',
  CreateAsset: 'MsgCreateAsset'



};

export default transactionTypes;
