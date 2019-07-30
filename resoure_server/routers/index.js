/**
 * 整合所有子路由
 */

const router = require('koa-router')();

const blockchain = require('./blockchain_router');
//const offchain = require('./offchain_router');

//router.use('/', home.routes(), home.allowedMethods())
router.use('/blockchain', blockchain.routes(), blockchain.allowedMethods());
//router.use('/offchain_router', offchain.routes(), offchain.allowedMethods());


module.exports = router;
