//要先將token利用geth中所保存的私鑰加密
const fs = require('fs');
const Web3 = require('web3');
const web3 = new Web3(Web3.givenProvider || `ws://localhost:8546`);
const config = require('../../config/config');

module.exports = async function encrypt_token(data) {

    let releaseToken = JSON.parse(fs.readFileSync('./releaseToken.json', 'utf-8'));

    return new Promise((resolve, reject) => {
        //arg: token,account.password
        web3.eth.personal.sign(releaseToken.access_token, config.geth.rqp_account, config.geth.password)
            .then((result) => {
                let data = JSON.stringify(result);
                fs.writeFileSync('./signedMessage.json', data);
                console.log(`signed_message:${data}`);
                resolve(data);
            })
            .catch(function(err) {
                console.log(err);
                reject(err);
            });
    });
};