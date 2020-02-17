"use strict";
const fs = require('fs');
const config = require('../../config/config');
let gethWebsocketUrl = config.geth.gethWebsocketUrl;
const Web3 = require('web3');
// use the given Provider, e.g in Mist, or instantiate a new websocket provider
const web3 = new Web3(Web3.givenProvider || gethWebsocketUrl);


module.exports = async function check_Identifier(data) {
    let RM_Abi = config.RM.abi;
    let RM_Address = fs.readFileSync('./RM_address.txt').toString();
    let RM = new web3.eth.Contract(RM_Abi,RM_Address);
    //RM.options.address = fs.readFileSync('./RM_address.txt').toString();

    return new Promise((resolve, reject) => {
        RM.methods.checkIdentifier(data.identifier).call()
            .then((return_result) => {
                console.log(`return_result: ${return_result}`);
                resolve(return_result);
            })
            .catch(function(err) {
            console.log(err);
            reject(err);
        });
    });

}