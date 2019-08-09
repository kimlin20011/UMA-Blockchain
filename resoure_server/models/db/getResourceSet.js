"use strict";
const db = require('../connection_db');



module.exports = async function registerResourceSet(data) {

    let rmAddress = data.address;

    return new Promise((resolve, reject) => {
        let result = {};
        let sql=`SELECT * FROM resourceSet WHERE rmAddress = ?`;
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
            resolve(result);
        });

    })

    /*    console.log(req.query.id);
        let sql=`SELECT * FROM IdMapContract WHERE 1`;
        db.query(sql,function(err,ressql){
            if(!err){
                //console.log(ressql);
                res.json(ressql);
            }
            else{
                res.status(500).json({err:"DBError"});
            }
        });*/

};

