const router = require('koa-router')();
const auth = require('../controllers/auth_controller');

module.exports = router
    .post(`/setPolicy`, auth.setPolicy)
    .post(`/setScopeindividual`, auth.setScopeindividual)
    .post(`/generateTicket`, auth.generateTicket)