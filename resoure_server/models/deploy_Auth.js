"use strict";
const fs = require('fs');
const config = require('../config/config');
let gethWebsocketUrl = config.geth.gethWebsocketUrl;
const Web3 = require('web3');
// use the given Provider, e.g in Mist, or instantiate a new websocket provider
const web3 = new Web3(Web3.givenProvider || gethWebsocketUrl);
const unlockAccount = require('./unlock');

module.exports = async function deploy_resource_manage_contract(){
    let Auth_Bytecode = config.Auth.bytecode;
    let Auth_Abi = config.Auth.abi;
    //取得目前geth中第一個account
    let nowAccount ="";
    //先用第一組帳號，要用那組之後可以討論
    await web3.eth.getAccounts((err, res) => {nowAccount = res[0]} );

    let password = config.geth.password;
    let Auth = new web3.eth.Contract(Auth_Abi);

    // 解鎖
    let unlock = await unlockAccount(nowAccount,password);
    if (!unlock) {
        console.log(`not unlock`);
        return;
    }

    return new Promise((resolve, reject) => {
        let RM_Address = fs.readFileSync('./RM_address.txt').toString();
        Auth
            .deploy({
                data: Auth_Bytecode,
                arguments: [RM_Address]
            })
            .send({
                from: nowAccount,
                gas: 6000000
            })
            .on('error', function(error){
                reject(`部署失敗${error}`);
            })
            .on("receipt", function(receipt) {
                console.log(receipt);
                // 更新合約介面
                let Auth_address = receipt.contractAddress;
                //將新生成的RM地址寫進.txt檔案
                fs.writeFileSync('./Auth_address.txt', Auth_address);
                resolve(`Auth contract 合約地址:${Auth_address}`);
            })
    });
};

