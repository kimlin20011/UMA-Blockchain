"use strict";
const fs = require('fs');
const config = require('../../config/config');
let gethWebsocketUrl = config.geth.gethWebsocketUrl;
const Web3 = require('web3');
// use the given Provider, e.g in Mist, or instantiate a new websocket provider
const web3 = new Web3(Web3.givenProvider || gethWebsocketUrl);
const unlockAccount = require('../unlock');
const db = require('../connection_db');

module.exports = async function set_Policy(data) {
    let Auth_Abi = config.Auth.abi;
    //取得目前geth中第一個account
    let nowAccount = data.account;
    let _identifier = data.identifier;
    let _claim = data.claim;
    let _hint = data.hint;
    let Auth_Address =data.authAddress;
    let password = data.password;

    //let nowAccount =config.geth.account;
    //let password = config.geth.password;
    //let Auth_Address = fs.readFileSync('./Auth_address.txt').toString();

    let Auth = new web3.eth.Contract(Auth_Abi,Auth_Address);

    // 解鎖
    let unlock = await unlockAccount(nowAccount,password);
    if (!unlock) {
        console.log(`not unlock`);
        return;
    }

    return new Promise((resolve, reject) => {
        let result ={};
        Auth.methods
            .setPolicy(_identifier,_claim,_hint)
            .send({
                from: nowAccount,
                gas: 3000000
            })
            .on("receipt", function(receipt) {
                console.log(receipt);
                let metaData ={};
                metaData.policy_identifier=_identifier;
                metaData.claim= _claim;
                metaData.hint = _hint;
                let pre_sql=`SELECT * FROM policy WHERE policy_identifier = ?`;
                db.query(pre_sql, _identifier , function (err, rows) {
                    if (err) {
                        result.dbInfo = "資料庫更新失敗。";
                        result.err = err;
                        result.status = false;
                        reject(result);
                    }else if (rows.length === 0){
                        //若資料庫中沒有id值，直接插入
                        let sql = `INSERT INTO policy SET ?`
                        db.query(sql, metaData , function (err, rows) {
                            if (err) {
                                result.dbInfo = "資料庫insert失敗。";
                                result.err = err;
                                result.status = false;
                                reject(result);
                            }
                            result.dbInfo = "資料庫policy更新成功。";
                            result.status = true;
                            resolve(result);
                        });
                    }else if (rows.length > 0){
                        let sql = `UPDATE policy SET ? WHERE policy_identifier = ?`;
                        db.query(sql, [metaData,_identifier] , function (err, rows) {
                            if (err) {
                                result.dbInfo = "資料庫Update失敗。";
                                result.err = err;
                                result.status = false;
                                reject(result);
                            }
                            result.dbInfo = "資料庫policy更新成功。";
                            result.status = true;
                            resolve(result);
                        });
                    }
                });
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
