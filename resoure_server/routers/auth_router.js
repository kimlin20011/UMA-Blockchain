const router = require('koa-router')();
const auth = require('../controllers/auth_controller');

module.exports = router
    .post(`/setPolicy`, auth.setPolicy)
    .post(`/setScopeindividual`, auth.setScopeIndividual)
    .post(`/generateTicket`, auth.generateTicket)
    .post(`/releaseToken`, auth.releaseToken)
    .get(`/checkScopeByIdentifier`, auth.checkScopeByIdentifier)
    .get(`/introspectAccessToken`, auth.introspectAccessToken);

