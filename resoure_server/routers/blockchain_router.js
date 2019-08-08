const router = require('koa-router')();
const blockchain = require('../controllers/blockchain_controller');

module.exports = router
    .post('/deploy_RM', blockchain.deploy_RM_contract)
    .post('/deploy_Auth', blockchain.deploy_Auth_contract)
    .get('/accounts', blockchain.getAccounts)

