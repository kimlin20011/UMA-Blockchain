const router = require('koa-router')();
const auth = require('../controllers/auth_controller');

module.exports = router
    .post(`/setPolicy`, auth.setPolicy)
    .post(`/setScopeindividual`, auth.setScopeIndividual)
    .post(`/setParticipantOfIdentifier`, auth.setParticipantOfIdentifier)
    .post(`/requestPermission`, auth.requestPermission)
    .post(`/requestAccessToken`, auth.requestAccessToken)
    .get(`/checkScopeByIdentifier`, auth.checkScopeByIdentifier)
    .get(`/introspectAccessToken`, auth.introspectAccessToken);

