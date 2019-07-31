"use strict";
const fs = require('fs');
const config = require('../../config/config');
let gethWebsocketUrl = config.geth.gethWebsocketUrl;
const Web3 = require('web3');
// use the given Provider, e.g in Mist, or instantiate a new websocket provider
const web3 = new Web3(Web3.givenProvider || gethWebsocketUrl);
const unlockAccount = require('../unlock');

module.exports = async function generateTicket(data) {
    let Auth_Abi = config.Auth.abi;
    //取得目前geth中第一個account
    let nowAccount =config.geth.account;
    let _identifier = data.identifier;

    let password = config.geth.password;
    let Auth_Address = fs.readFileSync('./Auth_address.txt').toString();
    let Auth = new web3.eth.Contract(Auth_Abi,Auth_Address);

    // 解鎖
    let unlock = await unlockAccount(nowAccount,password);
    if (!unlock) {
        console.log(`not unlock`);
        return;
    };

    return new Promise((resolve, reject) => {
        let result ={};
        Auth.methods
            .generate_ticket(_identifier)
            .send({
                from: nowAccount,
                gas: 3000000
            })
            .on("receipt", function(receipt) {
                result.identifier = receipt.events.ticket_generated.returnValues.identifier;
                result.claim_hint = receipt.events.ticket_generated.returnValues.claim_hint;
                result.ticket = receipt.events.ticket_generated.returnValues.ticket;
                let result_event = JSON.stringify(result);
                fs.writeFileSync('./tickets.json', result_event);
                //送出驗證求取伺服器ip授權層序
                //回傳值*/
                //resolve(receipt.events.participantAdded.returnValues.newParticipant);
                resolve(result);
            })
            .on("error", function(error) {
                result.info =`智能合約setPolicy操作失敗`;
                result.error= error.toString();
                result.status = false;
                console.log(result);
                reject(result);
            });
    });
};
