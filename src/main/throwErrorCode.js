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
  Import_failed_address_exists: '40|Import failed,address already exists,'
};
