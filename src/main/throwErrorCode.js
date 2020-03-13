export var throwErrorCode = function (codemsg, Othermsg) {
  var info = codemsg.split('|');
  Othermsg = Othermsg || '';
  throw new Error(JSON.stringify({
    code: 'wallet-' + info[1],
    errorType: info[0],
    message: info[2] + Othermsg
  }));
};


export var errorList = {
  'Context_cannot_empty': 'Context_cannot_empty|1|Context cannot be empty',
  'This_modal_no_context': 'This_modal_no_context|2|This modal has no context',
  'not_connected': 'not_connected|3|Currently not connected to a secure node. Please try again when Lunie has secured a connection',
  'no_message_send': 'no_message_send|4|No message to send',
  'no_message_type': 'no_message_type|5|No message type present',
  'Invalid_message_type': 'Invalid_message_type|6|Invalid message type:',
  'need_address': 'need_address|21|need address',
  'not_find_DefaultWallet': 'not_find_DefaultWallet|31|not find DefaultWallet',
  'can_not_find_mnemonic': 'can_not_find_mnemonic|32|can not find  mnemonic',
  'Import_failed_address_already_exists': 'Import_failed_address_already_exists|33|Import failed,address already exists,',
  'main_account_not_current_account': 'main_account_not_current_account|34|The main account corresponding to mnemonic times is inconsistent with the current account ',
  'failed_already_exists': 'failed_already_exists|35|failed already exists,',
  'more12_words': 'more12_words|36|make sure  inputting 12 words or more ',
  'invalid_mnemonic': 'invalid_mnemonic|37|invalid mnemonic, please check,',
  'failed_address_not_exists': 'failed_address_not_exists|38|failed,address not exists,',
  'Import_failed_check_password': 'Import_failed_check_password|39|Import failed,Please check the wallet file and password',
  'Import_failed_address_exists': 'Import_failed_address_exists|40|Import failed,address already exists,',
  'need_marketName': 'need_marketName|rpc51|need marketName',
  'need_orderType': 'need_orderType|rpc52|need orderType',
  'need_page': 'need_page|rpc53|need page',
  'need_limit': 'need_limit|rpc54|need limit',
  'need_marketAddress': 'need_marketAddress|rpc55|need marketAddress',
  'need_statusType': 'need_statusType|rpc56|need statusType',
  'need_orderId': 'need_orderId|rpc57:need orderId',
  'need_accesskey': 'need_accesskey|rpc59|need accesskey',
  'need_secretkey': 'need_secretkey|rpc510|need secretkey',
  'need_port': 'need_port|rpc511|need port',
  'need_port_and': 'need_port_and|rpc512|need port and port < 65535 ',
  'need_defaultAddress': 'need_defaultAddress|rpc513|need defaultAddress',
  'Incorrect_address_format': 'Incorrect_address_format|rpc62|Incorrect address format',
  'need_password': 'need_password|rpc63|need password',
  'need_name': 'need_name|rpc64|need name',
  'need_filepath': 'need_filepath|rpc65|need filepath',
  'need_mnemonic': 'need_mnemonic|rpc67|need mnemonic',
  'need_to_address': 'need_to_address|rpc68|need to address',
  'need_amount': 'need_amount|rpc69|need amount',
  'Incorrect_amount_format': 'Incorrect_amount_format|rpc610|Incorrect amount format',
  'need_to_gas': 'need_to_gas|rpc611|need to gas',
  'Incorrect_gas_format': 'Incorrect_gas_format|rpc612|Incorrect gas format',
  'need_asset': 'need_asset|rpc613|need asset',
  'need_ProposalID': 'need_ProposalID|rpc614|need ProposalID',
  'need_option': 'need_option|rpc616|need option',
  'need_miningAddress': 'need_miningAddress|rpc617|need miningAddress',
  'need_dhtId': 'need_dhtId|rpc618|need dhtId',
  'need_SourceAddress': 'need_SourceAddress|rpc619|need need SourceAddress',
  'need_DestinationAddress': 'need_DestinationAddress|rpc620|need DestinationAddress',
  'need_price': 'need_price|rpc622|need price',
  'need_rate': 'need_rate|rpc623|need_rate',
  'need_description': 'need_description|rpc624|need_description',
  'need_cancelTimeDuration': 'need_cancelTimeDuration|rpc625|need cancelTimeDuration',
  'need_minBuySize': 'need_minBuySize|rpc626|need minBuySize',
  'need_minBuyDuration': 'need_minBuyDuration|rpc627|need minBuyDuration',
  'need_maxBuyDuration': 'need_maxBuyDuration|rpc628|need maxBuyDuration',
  'need_duration': 'need_duration|rpc629|need duration',
  'need_size': 'need_size|rpc629|need size',
  'need_file': 'need_file|rpc630|need file',
  'need_gasprice': 'need_gasprice|rpc631|need gasprice',
  'gaspricemust_be_numeric': 'gaspricemust_be_numeric|rpc632|gaspricemust be numeric'
};
