"use strict";
const fs = require('fs');
const config = require('../../config/config');
let gethWebsocketUrl = config.geth.gethWebsocketUrl;
const Web3 = require('web3');
// use the given Provider, e.g in Mist, or instantiate a new websocket provider
const web3 = new Web3(Web3.givenProvider || gethWebsocketUrl);
const unlockAccount = require('../unlock');
const db = require('../connection_db');


module.exports = async function set_ParticipantOfIdentifier(data) {
    let Auth_Abi = config.Auth.abi;
    //取得目前geth中第一個account
    //let nowAccount =config.geth.account;

    //let password = config.geth.password;
    //let Auth_Address = fs.readFileSync('./Auth_address.txt').toString();
    let nowAccount = data.account;
    let Auth_Address =data.authAddress;
    let password = data.password;
    let Auth = new web3.eth.Contract(Auth_Abi,Auth_Address);

    //console.log(`nowAccount:${nowAccount}\nAuth_Address:${Auth_Address}\nrqpAddress:${data.rqpAddress}`)

    // 解鎖
    let unlock = await unlockAccount(nowAccount,password);
    if (!unlock) {
        console.log(`not unlock`);
        return;
    }

    return new Promise((resolve, reject) => {
        let result ={};
        Auth.methods
            .setParticipantOfIdentifier(data.identifier,data.rqpAddress)
            .send({
                from: nowAccount,
                gas: 3000000
            })
            .on("receipt", function(receipt) {
                //resolve(`註冊成功${result}`);
                result.identifier = receipt.events.participantAdd.returnValues.identifier;
                result.newParticipant = receipt.events.participantAdd.returnValues.newParticipant;
                console.log(receipt);
                //let result_event = JSON.stringify(result);
                //fs.writeFileSync('./participantOfIdentifier.json', result_event);
                let metaData ={};
                metaData.rqp_identifier=result.identifier;
                metaData.rqp_address=result.newParticipant;

                let pre_sql=`SELECT * FROM requestParty WHERE rqp_identifier = ? AND rqp_address = ?`;
                db.query(pre_sql, [result.identifier, result.newParticipant], function (err, rows) {
                    console.log(rows);
                    if (err) {
                        result.dbInfo = "資料庫更新失敗。";
                        result.err = err;
                        result.status = false;
                        reject(result);
                    }else if (rows.length === 0){
                        //若資料庫中沒有id值，直接插入
                        let sql = `INSERT INTO requestParty SET ?`;
                        db.query(sql, metaData , function (err, rows) {
                            if (err) {
                                result.dbInfo = "資料庫insert失敗。";
                                result.err = err;
                                result.status = false;
                                reject(result);
                            }
                            result.dbInfo = "資料庫requestParty更新成功。";
                            result.status = true;
                            resolve(result);
                        });
                    }else if (rows.length > 0){
                        result.dbInfo = "資料庫requestParty已有rqp_address資料";
                        result.status = true;
                        resolve(result);
                    }
                });
            })
            .on("error", function(error) {
                result.info =`智能合約setParticipantOfIdentifier操作失敗`;
                result.error= error.toString();
                result.status = false;
                console.log(result);
                reject(result);
            });
    });
};
