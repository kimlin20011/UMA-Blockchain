//要先將token利用geth中所保存的私鑰加密
const fs = require('fs');
const Web3 = require('web3');
const web3 = new Web3(Web3.givenProvider || `ws://localhost:8546`);
//token,account.password
web3.eth.personal.sign(`0xc370fece715496dd1a7ceda48aee5a5909b66e25c5dd6f5057411c2e5c8f1dd6`, `0xe8902cf406d7547fc3f69a2f463eb1463aa6b978`, `nccutest`)
    .then((result) => {
        let data = JSON.stringify(result);
        fs.writeFileSync('./signedMessage.json', data);
        console.log(`signed_message:${data}`);
});