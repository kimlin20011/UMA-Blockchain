"use strict";
const fs = require('fs');
const config = require('../../config/config');
let gethWebsocketUrl = config.geth.gethWebsocketUrl;
const Web3 = require('web3');
// use the given Provider, e.g in Mist, or instantiate a new websocket provider
const web3 = new Web3(Web3.givenProvider || gethWebsocketUrl);


module.exports = async function check_scopeByIdentifier(data) {
    let Auth_Abi = config.Auth.abi;
    let Auth_Address = fs.readFileSync('./Auth_address.txt').toString();
    let Auth = new web3.eth.Contract(Auth_Abi,Auth_Address);

    return new Promise((resolve, reject) => {
        Auth.methods.checkScopeByIdentifier(data.identifier,data.scope).call()
            .then((return_result) => {
                console.log(`return_result: ${return_result}`);
                resolve(return_result);
            })
            .catch(function(err) {
                console.log(err);
                reject(err);
            });
    });
};