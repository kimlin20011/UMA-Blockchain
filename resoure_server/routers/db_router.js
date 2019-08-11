const router = require('koa-router')();
const db = require('../controllers/db_controller');

module.exports = router
    .post(`/getResourceSet`,db.getResourceSet)
    .post(`/getPolicy`,db.getPolicy);
