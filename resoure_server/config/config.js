//下指令編譯新合約 solcjs -o ./ --bin --abi FourPattern_Two.sol
const fs = require('fs');
require('dotenv').config();

//讀進合約abi,bytecode
const RM_Abi = JSON.parse(fs.readFileSync('./migrate/uma_sol_Resource_management_contract.abi').toString());
const RM_Bytecode = '0x' + fs.readFileSync('./migrate/uma_sol_Resource_management_contract.bin').toString();
const Auth_Abi = JSON.parse(fs.readFileSync('./migrate/uma_sol_Authorization_contract.abi').toString());
const Auth_Bytecode = '0x' + fs.readFileSync('./migrate/uma_sol_Authorization_contract.bin').toString();

module.exports ={
    port: 3001,
    auth:{
        auth_dur:13
    },
    RM: {
        abi: RM_Abi,
        bytecode: RM_Bytecode,
    },
    Auth: {
        abi: Auth_Abi,
        bytecode: Auth_Bytecode,
    },
    geth: {
        account: `0xe8902cf406d7547fc3f69a2f463eb1463aa6b978`,
        //account: `0xdfbc7a1f5f867a9fd73d9fbe9da2b5b34ea67d95`,
        rqp_account: `0xe8902cf406d7547fc3f69a2f463eb1463aa6b978`,
        //暫時不用
        password: process.env.password,
        gethWebsocketUrl:`ws://localhost:8546`,
        //keystoreDir:`C:\\Users\\nccu\\implement\\chain_new\\data\\keystore`
        keystoreDir:`/Users/nccu/Documents/implement/chain_new/data/keystore`
    },
    mysql:{
        host: process.env.HOST,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE
    }
};
