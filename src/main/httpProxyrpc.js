var log = require('../log').log;
const eipc = require('electron-better-ipc');
const axios =require('axios');

export default function(){

    eipc.answerRenderer('httpgetstatus', async (query) => {
        log.info('httpget:'+query.url)
        try {
            const result = await axios.get(query.url, {
                params: query.data||{}
              })
            return {data:result,state:true} ;
            
        } catch (error) {
            log.error(error)
            return {data:error,state:false} 
            
        }
        
    
          
    });

}