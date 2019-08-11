"use strict";
const db = require('../connection_db');



module.exports = async function getPolicy(data) {

    let identifier = data.identifier;

    return new Promise((resolve, reject) => {
        let result = {};
        let policy_sql=`SELECT * FROM policy WHERE policy_identifier = ?`;
        let rqp_sql=`SELECT * FROM requestParty WHERE rqp_identifier = ?`;
        db.query(policy_sql,[identifier], function (err, policyRows) {
            if (err) {
                //console.log(err);
                result.dbInfo = "policy資料庫搜尋失敗。";
                result.err = err;
                result.status = false;
                reject(result);
            }
            db.query(rqp_sql,[identifier], function (err, rqpRows) {
                if (err) {
                    result.dbInfo = "rqp資料庫搜尋失敗。";
                    result.err = err;
                    result.status = false;
                    reject(result);
                }
                result.rqpInfo = rqpRows;
                result.policyInfo = policyRows;
                result.status = true;
                resolve(result);
            });
        });

    })
};

