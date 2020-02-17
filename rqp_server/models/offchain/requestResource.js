"use strict";
const db = require('../connection_db');
const request = require('request');



module.exports = async function requestResource(data) {
    let name = data.name;
    return new Promise((resolve, reject) => {
        let result = {};
        let sql=`SELECT identifier FROM resourceSet WHERE name = ?`;
        db.query(sql,[name], function (err, rows) {
            if (err) {
                //console.log(err);
                result.dbInfo = "資料庫搜尋失敗。";
                result.err = err;
                result.status = false;
                reject(result);
            } else if (rows.length === 0){
                result.dbInfo = "沒有相對應resource資料。";
                result.status = false;
                reject(result);
            }else if (rows.length > 1){
                result.dbInfo = "資料庫有重複資資料，請更新資料庫資料。";
                result.status = false;
                reject(result);
            }else{
                result.dbInfo = "identifier取得成功";
                result.identifier = rows[0].identifier;
                result.rqpAddress = data.rqpAddress;
                request.post({
                    url:"http://localhost:3001/auth/requestPermission",
                    body: result,
                    json: true,
                }, function(err,httpResponse,body){
                    if (err) {
                        reject(err);
                    }
                    result.status = body.status;
                    result.body = body;
                    resolve(result);
                });
            }
        });

    })
};

