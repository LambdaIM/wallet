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
  WithdrawValidatorCommission: `MsgWithdrawValidatorCommission`
};

export default transactionTypes;
