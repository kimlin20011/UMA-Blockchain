"use strict";
const fs = require('fs');
const config = require('../../config/config');
let gethWebsocketUrl = config.geth.gethWebsocketUrl;
const Web3 = require('web3');
// use the given Provider, e.g in Mist, or instantiate a new websocket provider
const web3 = new Web3(Web3.givenProvider || gethWebsocketUrl);
const EthCrypto = require('eth-crypto');

module.exports = async function introspect_accessToken(data) {
    let Auth_Abi = config.Auth.abi;
    let Auth_Address = fs.readFileSync('./Auth_address.txt').toString();
    let Auth = new web3.eth.Contract(Auth_Abi,Auth_Address);

    //parse signature to vrs
    let signature = JSON.parse(fs.readFileSync('./signedMessage.json', 'utf-8'));
    let vrs = EthCrypto.vrs.fromString(signature.toString());
    console.log(vrs)

    return new Promise((resolve, reject) => {
        let result ={};
        Auth.methods.introspectAccessToken(data.token,vrs.v,vrs.r,vrs.s).call()
            .then((return_result) => {
                result.isSignedAccountVaild = (return_result.toLowerCase() === config.geth.rqp_account.toLowerCase());
                result.signedAccount = return_result;
                //console.log(`signed account: ${return_result}`);
                resolve(result);
            })
            .catch(function(err) {
                console.log(err);
                reject(err);
            });
    });
};