const router = require('koa-router')();
const offChain = require('../controllers/offchain_controller');

module.exports = router
    .post('/requestResource', offChain.requestResource);
