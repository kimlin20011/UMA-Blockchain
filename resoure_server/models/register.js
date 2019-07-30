"use strict";
const fs = require('fs');
const config = require('../config/config');
let gethWebsocketUrl = config.geth.gethWebsocketUrl;
const Web3 = require('web3');
// use the given Provider, e.g in Mist, or instantiate a new websocket provider
const web3 = new Web3(Web3.givenProvider || gethWebsocketUrl);
const unlockAccount = require('./unlock');

module.exports = async function registerResourceSet(data) {
    let RM_Abi = config.RM.abi;
//取得目前geth中第一個account
    let nowAccount =config.geth.account;
    let name = data.name;
    let scope = data.scope;
    console.log(data);

    let password = config.geth.password;
    let RM = new web3.eth.Contract(RM_Abi);
    RM.options.address = await fs.readFileSync('./RM_address.txt').toString();
    // 解鎖
    let unlock = await unlockAccount(nowAccount,password);
    if (!unlock) {
        console.log(`not unlock`);
        return;
    };
    return new Promise((resolve, reject) => {
        let result ={};
        RM.methods
            .registerResourceSet(name,scope)
            .send({
                from: nowAccount,
                gas: 3000000
            })
            .on("receipt", function(receipt) {

                //fs.writeFileSync('./Participant.txt', receipt.events.participantAdded.returnValues.newParticipant);
                result.registerTime = receipt.events.addedResourceSet.returnValues.registerTime;
                result.name = receipt.events.addedResourceSet.returnValues.name;
                result.identifier = receipt.events.addedResourceSet.returnValues.identifier;
                let result_event = JSON.stringify(result);
                fs.writeFileSync('./identifier.json', result_event);
                //送出驗證求取伺服器ip授權層序
                //回傳值*/
                //resolve(receipt.events.participantAdded.returnValues.newParticipant);
                resolve(result);
            })
            .on("error", function(error) {
                result.info =`智能合約registerResourceSet操作失敗`;
                result.error= error.toString();
                result.status = false;
                console.log(result);
                reject(result);
            });
    });
};
