const set_Policy = require('../models/auth/setPolicy');
const set_Scopeindividual = require('../models/auth/setScopeIndividual');
const generate_ticket = require('../models/auth/generateTicket');
const release_token = require('../models/auth/releaseToken');
const check_scopeByIdentifier = require('../models/auth/checkScopeByIdentifier');
const introspect_accessToken = require('../models/auth/introspectAccessToken');

module.exports = {
    async setPolicy(ctx) {
        let formData = ctx.request.body;
        let res = {};
        let setPolicy_result = await set_Policy(formData);
        res = setPolicy_result;
        ctx.body = res;
    },
    async setScopeIndividual(ctx) {
        let formData = ctx.request.body;
        let res = {};
        let setScopeindividual_result = await set_Scopeindividual(formData);
        res = setScopeindividual_result;
        ctx.body = res;
    },
    async generateTicket(ctx) {
        let formData = ctx.request.body;
        let res = {};
        let generateTicket_result = await generate_ticket(formData);
        res = generateTicket_result;
        ctx.body = res;
    },
    async releaseToken(ctx) {
        let formData = ctx.request.body;
        let res = {};
        let releaseToken_result = await release_token(formData);
        res = releaseToken_result;
        ctx.body = res;
    },
    async checkScopeByIdentifier(ctx) {
        let formData = ctx.request.body;
        let res = {};
        let checkScopeByIdentifier_result = await check_scopeByIdentifier(formData);
        res = checkScopeByIdentifier_result;
        ctx.body = res;
    },
    async introspectAccessToken(ctx) {
        let formData = ctx.request.body;
        let res = {};
        let introspectAccessToken_result = await introspect_accessToken(formData);
        res = introspectAccessToken_result;
        ctx.body = res;
    },
}