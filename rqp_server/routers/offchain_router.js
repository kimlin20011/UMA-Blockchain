const router = require('koa-router')();
const offChain = require('../controllers/offchain_controller');

module.exports = router
    .get('/requestResource', offChain.requestResource);
