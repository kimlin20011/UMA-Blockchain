"use strict";
const db = require('../connection_db');
const fs = require('fs');


module.exports = async function getResourceName() {
    let rmAddress = fs.readFileSync('./RM_address.txt').toString();
    //console.log(`rmAddress:${rmAddress}`)

    return new Promise((resolve, reject) => {
        let result = {};
        let sql=`SELECT name FROM resourceSet WHERE rmAddress = ?`;
        db.query(sql,[rmAddress], function (err, rows) {
            if (err) {
                //console.log(err);
                result.dbInfo = "資料庫搜尋失敗。";
                result.err = err;
                result.status = false;
                reject(result);
            }
            result.info = rows;
            result.status = true;
            console.log(result);
            resolve(result);
        });

    })
};
