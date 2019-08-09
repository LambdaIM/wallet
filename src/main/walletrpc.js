const eipc = require('electron-better-ipc');
const path = require('path');
const { shell } = require('electron');

var {DAEMON_CONFIG} =require('../configmain.js')
var fs = require('graceful-fs')
var log = require('../log').log;

// var walletManger =require('./walletManger.js')
// var resultView =require('./result.js')
import walletManger from './walletManger.js';
import resultView from './result.js';
import isAddress from '../utils/isaddress.js';


// var WM =new walletManger();
export default  function(){

    var WM =new walletManger();    
    eipc.answerRenderer('walletList',async(query)=>{
        try{
            var result = WM.getWalletList();
            return resultView(result,true)

        }catch(ex){
            throw resultView(null,false,ex)
        }
    })
    eipc.answerRenderer('setDefaultWallet',async(query)=>{
        var address =query.address;
        if(address==undefined){
            throw resultView(null,false,'need address')
        }
        // if(isAddress(address)==false){
        //暂时注释地址合法的判断
        if(address==false){
            throw resultView(null,false,'Incorrect address format')
        }
        try{
            WM.setDefaultWallet(address);
            return resultView(null,true)

        }catch(ex){
            throw resultView(null,false,ex)
        }
    })

    eipc.answerRenderer('loginDefaultWallet',async(query)=>{
        log.info('loginDefaultWallet')
        var password =query.password;
        if(password == undefined){
            throw resultView(null,false,'need password')
        }
        try{
            var info = WM.OpenDefaultwallet(password);
            return resultView({
                address:info.address,
                name:info.name
            },true)

        }catch(ex){
            throw resultView(null,false,ex)
        }
    })
    eipc.answerRenderer('defaultWalletBasicinfo',async(query)=>{

        try{
            var info = WM.getDefaultwalletBasicinfo();
            return resultView(info,true)

        }catch(ex){
            throw resultView(null,false,ex)
        }

    })
    // log.info('start createWallet');
    eipc.answerRenderer('createWallet',(query)=>{
        log.info('createWallet');
        var {password,name} =query;
        if(password==undefined){
            throw resultView(null,false,'need password')
        }
        if(name == undefined){
            throw resultView(null,false,'need name')
        }
        try{
            var info = WM.creatWallet(password,name);
            return resultView(info,true)

        }catch(ex){
            throw resultView(null,false,ex)
        }
        
    })

    eipc.answerRenderer('importWalletBykeyStore',async(query)=>{
        var {filepath,password,name} =query;
        if(filepath==undefined){
            throw resultView(null,false,'need filepath')
        }
        if(password==undefined){
            throw resultView(null,false,'need password')
        }
        if(name == undefined){
            throw resultView(null,false,'need name')
        }

        try{
            WM.ImportWalletBykeyStore(filepath,password,name);
            return resultView(null,true)

        }catch(ex){
            throw resultView(null,false,ex)
        }
        
    })

    eipc.answerRenderer('ImportWalletByMnemonic',async(query)=>{
        var {mnemonic,password,name} =query;

        if(mnemonic==undefined){
            throw resultView(null,false,'need mnemonic')
        }
        if(password==undefined){
            throw resultView(null,false,'need password')
        }
        if(name == undefined){
            throw resultView(null,false,'need name')
        }

        try{
             WM.ImportWalletByMnemonic(mnemonic,password,name);
            return resultView(null,true)

        }catch(ex){
            throw resultView(null,false,ex)
        }
        
    })


    eipc.answerRenderer('defaultWalletBlance',async(query)=>{
        try{
            var Liquid  = await WM.getDefaultWalletBlance();
            var Delegation = await WM.getDelegationsBalance();
            var DistributionReward = await WM.getDistributionRewards();
            
            return resultView({
                Liquid:Liquid,
                Delegation:Delegation,
                DistributionReward:DistributionReward
            },true)
        }catch(ex){
            throw resultView(null,false,ex)
        }
    })



    eipc.answerRenderer('transfer',async(query)=>{
        var {to,amount,gas} = query;
        // to 需要判断 账号的格式是否合理呵护规则
        // amount 需要判断  转账金额大小 数据类型
        // gas 目前默认值位1  转账金额大小 数据类型
        if(to==undefined){
            throw resultView(null,false,'need to address')
        }
        //需要寻找新的考验地址格式
        // if(isAddress(to)==false){
        //     throw resultView(null,false,'Incorrect address format')
        // }
        

        if(amount==undefined){
            throw resultView(null,false,'need amount')
        }
        if(isNaN(parseInt(amount)) ){
            throw resultView(null,false,'Incorrect amount format')
        }

        if(gas==undefined){
            throw resultView(null,false,'need to gas')
        }

        if(isNaN(parseInt(gas)) ){
            throw resultView(null,false,'Incorrect gas format')
        }
        
        try{    
            var data = await WM.Transfer(to,amount,gas)
            return resultView(data,true)
        }catch(ex){
            throw resultView(null,false,ex)
        }
        
    })


    eipc.answerRenderer('transferDelegation',async(query)=>{
        var {to,amount,gas,isdege} = query;
        // to 需要判断 账号的格式是否合理呵护规则
        // amount 需要判断  转账金额大小 数据类型
        // gas 目前默认值位1  转账金额大小 数据类型
        if(to==undefined){
            throw resultView(null,false,'need to address')
        }
        //需要寻找新的考验地址格式
        // if(isAddress(to)==false){
        //     throw resultView(null,false,'Incorrect address format')
        // }
        

        if(amount==undefined){
            throw resultView(null,false,'need amount')
        }
        if(isNaN(parseInt(amount)) ){
            throw resultView(null,false,'Incorrect amount format')
        }

        if(gas==undefined){
            throw resultView(null,false,'need to gas')
        }

        if(isNaN(parseInt(gas)) ){
            throw resultView(null,false,'Incorrect gas format')
        }
        if(isdege==undefined){
            isdege=true
        }
        
        try{    
            var data = await WM.TransferDelegation(to,amount,gas,isdege)
            return resultView(data,true)
        }catch(ex){
            throw resultView(null,false,ex)
        }
        
    })
    eipc.answerRenderer('withdrawal',async(query)=>{
        var {to,amount,gas,isdege} = query;
        
        

        if(amount==undefined){
            throw resultView(null,false,'need amount')
        }
        
        try{    
            var data = await WM.TransferWithdrawal(to,amount,gas,isdege)
            return resultView(data,true)
        }catch(ex){
            throw resultView(null,false,ex)
        }
        
    })



    eipc.answerRenderer('transferConfirm',async(query)=>{
        log.info('transferConfirm rpc')
        var {password,transactiondata} = query;
        log.info(password);
        log.info(transactiondata);
        try{
            var data = await WM.TransferConfirm(password,transactiondata);   
            return resultView(data,true)
        }catch(ex){
            throw resultView(null,false,ex)
        }
        
    })

    eipc.answerRenderer('openkeystore', async (query) => {
        shell.showItemInFolder(DAEMON_CONFIG.BASE_PATH);
    });

    // eipc.answerRenderer('ViewDefaultWalletPrivatekey',async(query)=>{
    //     log.info('loginDefaultWallet')
    //     var password =query.password;
    //     if(password == undefined){
    //         return resultView(null,false,'need password')
    //     }
    //     try{
    //         var info = WM.OpenDefaultwallet(password);
    //         return resultView(info,true)

    //     }catch(ex){
    //         return resultView(null,false,ex)
    //     }
    // })


    eipc.answerRenderer('Walletsign',async(query)=>{
        log.info('Wallettransfer')
        
        var content=query.content;
        var password = query.password;

        try{
            var TxMessageload = await WM.SignData(password,content);   
        
        log.info(TxMessageload)
        return resultView(TxMessageload,true)  
        } catch (error) {

          throw resultView(null,false,error)
            
        }
  
      })

      eipc.answerRenderer('editWalletName',async(query)=>{
        log.info('Wallettransfer')
        var name=query.name;
        try{
            var TxMessageload = await WM.editDefaultName(name);   
            
            return resultView(TxMessageload,true)  
          
        } catch (error) {
          
          throw resultView(null,false,error)
        }
  
      })
  









}


