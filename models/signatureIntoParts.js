const EthCrypto = require('eth-crypto');
const fs = require('fs');
const Web3 = require('web3');
const web3 = new Web3(Web3.givenProvider || `ws://localhost:8546`);


let signature = JSON.parse(fs.readFileSync('./signedMessage.json', 'utf-8'));
let vrs = EthCrypto.vrs.fromString(signature.toString());


let data = JSON.stringify(vrs);
fs.writeFileSync('./vrs.json', data);


web3.eth.personal.ecRecover(`0xc370fece715496dd1a7ceda48aee5a5909b66e25c5dd6f5057411c2e5c8f1dd6`, signature)
    .then((address)=>{
        let recover_address = address;
        console.log(`recover_address:${recover_address}`);
    });

console.log(vrs);


