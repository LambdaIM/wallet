exports.throwErrorCode = function(codemsg, Othermsg) {
  var info = codemsg.split('|');
  throw new Error(JSON.stringify({
    code: 'wallet-' + info[0],
    message: info[1] + Othermsg
  }));
};


exports.errorList = {
  Context_cannot_empty: '1|Context cannot be empty',
  This_modal_no_context: '2|This modal has no context',
  not_connected: '3|Currently not connected to a secure node. Please try again when Lunie has secured a connection',
  no_message_send: '4|No message to send',
  no_message_type: '5|No message type present',
  Invalid_message_type: '6|Invalid message type:',
  need_address: '21|need address',
  not_find_DefaultWallet: '31|not find DefaultWallet',
  can_not_find_mnemonic: '32|can not find  mnemonic',
  Import_failed_address_already_exists: '33|Import failed,address already exists,',
  main_account_not_current_account: '34|The main account corresponding to mnemonic times is inconsistent with the current account ',
  failed_already_exists: '35|failed already exists,',
  more12_words: '36|make sure  inputting 12 words or more ',
  invalid_mnemonic: '37|invalid mnemonic, please check,',
  failed_address_not_exists: '38|failed,address not exists,',
  Import_failed_check_password: '39|Import failed,Please check the wallet file and password',
  Import_failed_address_exists: '40|Import failed,address already exists,',
  need_marketName: 'rpc51|need marketName',
  need_orderType: 'rpc52|need orderType',
  need_page: 'rpc53|need page',
  need_limit: 'rpc54|need limit',
  need_marketAddress: 'rpc55|need marketAddress',
  need_statusType: 'rpc56|need statusType',
  need_orderId: 'rpc57:need orderId',

  need_accesskey: 'rpc59|need accesskey',
  need_secretkey: 'rpc510|need secretkey',
  need_port: 'rpc511|need port',
  need_port_and: 'rpc512|need port and port < 65535 ',
  need_defaultAddress: 'rpc513|need defaultAddress',

  Incorrect_address_format: 'rpc62|Incorrect address format',
  need_password: 'rpc63|need password',
  need_name: 'rpc64|need name',
  need_filepath: 'rpc65|need filepath',

  need_mnemonic: 'rpc67|need mnemonic',
  need_to_address: 'rpc68|need to address',
  need_amount: 'rpc69|need amount',
  Incorrect_amount_format: 'rpc610|Incorrect amount format',
  need_to_gas: 'rpc611|need to gas',
  Incorrect_gas_format: 'rpc612|Incorrect gas format',
  need_asset: 'rpc613|need asset',
  need_ProposalID: 'rpc614|need ProposalID',

  need_option: 'rpc616|need option',
  need_miningAddress: 'rpc617|need miningAddress',
  need_dhtId: 'rpc618|need dhtId',
  need_SourceAddress: 'rpc619|need need SourceAddress',
  need_DestinationAddress: 'rpc620|need DestinationAddress',

  need_price: 'rpc622|need price',
  need_rate: 'rpc623|need_rate',
  need_description: 'rpc624|need_description',
  need_cancelTimeDuration: 'rpc625|need cancelTimeDuration',
  need_minBuySize: 'rpc626|need minBuySize',
  need_minBuyDuration: 'rpc627|need minBuyDuration',
  need_maxBuyDuration: 'rpc628|need maxBuyDuration',
  need_duration: 'rpc629|need duration',
  need_size: 'rpc629|need size',
  need_file: 'rpc630|need file',
  need_gasprice: 'rpc631|need gasprice',
  gaspricemust_be_numeric: 'rpc632|gaspricemust be numeric'



};
