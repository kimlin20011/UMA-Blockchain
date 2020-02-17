const router = require('koa-router')();
const rm = require('../controllers/rm_controller');

module.exports = router
    .post(`/registerResourceSet`, rm.registerResourceSet)
    .get(`/checkIdentifier`, rm.checkIdentifier)
    .get(`/checkScope`,rm.checkScope)
