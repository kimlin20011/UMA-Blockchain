/**
 * 整合所有子路由
 */

const router = require('koa-router')();

const blockchain = require('./blockchain_router');
const resourceManage = require('./resourceManageRouter');
const auth = require('./auth_router');
const rqp = require('./request_party_router');
const db = require('./db_router');

router.use('/blockchain', blockchain.routes(), blockchain.allowedMethods());
router.use('/resourceManage', resourceManage.routes(), resourceManage.allowedMethods());
router.use('/auth', auth.routes(), auth.allowedMethods());
router.use('/rqp', rqp.routes(), rqp.allowedMethods());
router.use('/db', db.routes(), db.allowedMethods());


module.exports = router;
