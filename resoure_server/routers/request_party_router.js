const router = require('koa-router')();
const rqp = require('../controllers/request_party_controller');

module.exports = router
    .post(`/encryptToken`, rqp.encryptToken);
