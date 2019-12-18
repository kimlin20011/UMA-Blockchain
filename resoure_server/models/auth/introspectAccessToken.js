"use strict";
const fs = require('fs');
const config = require('../../config/config');
let gethWebsocketUrl = config.geth.gethWebsocketUrl;
const Web3 = require('web3');
// use the given Provider, e.g in Mist, or instantiate a new websocket provider
const web3 = new Web3(Web3.givenProvider || gethWebsocketUrl);
const EthCrypto = require('eth-crypto');
const unlockAccount = require('../unlock');

module.exports = async function introspect_accessToken(data) {
    let Auth_Abi = config.Auth.abi;
    let Auth_Address = fs.readFileSync('./Auth_address.txt').toString();
    let Auth = new web3.eth.Contract(Auth_Abi,Auth_Address);
    let nowAccount = config.geth.account;
    let password = config.geth.password;
    let signature = data.signature;

    let unlock = await unlockAccount(nowAccount,password);
    if (!unlock) {
        console.log(`not unlock`);
        return;
    }

    //parse signature to vrs
    //let signature = JSON.parse(fs.readFileSync('./signedMessage.json', 'utf-8'));
    let vrs = EthCrypto.vrs.fromString(signature.toString());
    // console.log(vrs);

    return new Promise((resolve, reject) => {
        let result ={};

        Auth.methods
            .introspectAccessToken(data.token,vrs.v,vrs.r,vrs.s)
            .send({
                from: nowAccount,
                gas: 3000000
            })
            .on("receipt", function(receipt) {
                //(bytes32 indexed identifier,string scope,address rqpAddress,uint iat, uint exp)
                result.iat = receipt.events.introspectEvent.returnValues.iat;
                result.exp = receipt.events.introspectEvent.returnValues.exp;
                result.status = true;
                result.isSignedAccountValid = true;
                // console.log(result);
                //  let result_event = JSON.stringify(result);
                //  event introspectEvent(bytes32 indexed identifier,string scope,address rqpAddress,uint iat, uint exp);
                //   fs.writeFileSync('./releaseToken.json', result_event);
                //送出驗證求取伺服器ip授權層序
                //回傳值*/
                resolve(result);
            })
            .on("error", function(error) {
                result.info =`智能合約introspectAccessToken操作失敗`;
                result.error= error.toString();
                result.status = false;
                result.isSignedAccountValid = false;
                console.log(result);
                reject(result);
            });
    });
};