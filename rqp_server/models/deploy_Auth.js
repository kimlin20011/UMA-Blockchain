"use strict";
const fs = require('fs');
const config = require('../config/config');
let gethWebsocketUrl = config.geth.gethWebsocketUrl;
const Web3 = require('web3');
// use the given Provider, e.g in Mist, or instantiate a new websocket provider
const web3 = new Web3(Web3.givenProvider || gethWebsocketUrl);
const unlockAccount = require('./unlock');
const db = require('./connection_db');

module.exports = async function deploy_resource_manage_contract(data){
    let Auth_Bytecode = config.Auth.bytecode;
    let Auth_Abi = config.Auth.abi;
    //取得目前geth中第一個account
    let nowAccount ="";
    //先用第一組帳號，要用那組之後可以討論
    //await web3.eth.getAccounts((err, res) => {nowAccount = res[0]} );

    //set body
    nowAccount = data.account;
    let password = data.password;
    let RM_Address = data.RM_Address;

        //let password = config.geth.password;
    let Auth = new web3.eth.Contract(Auth_Abi);

    // 解鎖
    let unlock = await unlockAccount(nowAccount,password);
    if (!unlock) {
        console.log(`not unlock`);
        return;
    }

    return new Promise((resolve, reject) => {
        //let RM_Address = fs.readFileSync('./RM_address.txt').toString();
        let result ={};
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
                result.info = error;
                result.status = false;
                reject(result);
            })
            .on("receipt", function(receipt) {
                console.log(receipt);
                // 更新合約介面
                let Auth_address = receipt.contractAddress;
                result.status = true;
                result.address = Auth_address;
                //將新生成的RM地址寫進.txt檔案
                fs.writeFileSync('./Auth_address.txt', Auth_address);
                let metaData ={};
                metaData.auth_address=Auth_address;
                console.log(`RM_Address: ${RM_Address}`);
                let sql = `UPDATE contract SET ? WHERE rm_address = ?;`
                //'UPDATE member SET ? WHERE id = ?', [memberUpdateData, id]
                db.query(sql,[metaData, RM_Address], function (err, rows) {
                    if (err) {
                        //console.log(err);
                        result.dbInfo = "資料庫更新失敗。";
                        result.err = err;
                        console.log(result);
                        reject(result);
                    }
                    result.dbInfo = "資料庫contract更新成功。";
                    console.log(result);
                    resolve(result);
                });
                //resolve(result);
            })
    });
};

