const set_Policy = require('../models/auth/setPolicy');
const set_Scopeindividual = require('../models/auth/setScopeIndividual');
const request_Permission = require('../models/auth/requestPermission');
const request_AccessToken = require('../models/auth/requestAccessToken');
const check_scopeByIdentifier = require('../models/auth/checkScopeByIdentifier');
const introspect_accessToken = require('../models/auth/introspectAccessToken_view');
const set_ParticipantOfIdentifier = require('../models/auth/setParticipantOfIdentifier');

module.exports = {
    async setPolicy(ctx) {
        let formData = ctx.request.body;
        let res = {};
        try{
            let setPolicy_result = await set_Policy(formData);
            res = setPolicy_result;
            ctx.body = res;
        } catch(error) {
            ctx.body = error;
        }
    },
    async setScopeIndividual(ctx) {
        let formData = ctx.request.body;
        let res = {};
        try{
            let setScopeindividual_result = await set_Scopeindividual(formData);
            res = setScopeindividual_result;
            ctx.body = res;
        } catch(error) {
            ctx.body = error;
        }
    },
    async requestPermission(ctx) {
        let formData = ctx.request.body;
        let res = {};
        try{
            // 為授權
            // ctx.respond
            // ctx.body = err.message;
            // ctx.app.emit("error", err, ctx);
            ///
            let requestPermission_result = await request_Permission(formData);
            res = requestPermission_result;
            ctx.status = 401;
            ctx.body = res;
        } catch(error) {
            ctx.body = error;
        }
    },
    async requestAccessToken(ctx) {
        let formData = ctx.request.body;
        let res = {};
        try{
            let requestAccessToken_result = await request_AccessToken(formData);
            res = requestAccessToken_result;
            ctx.body = res;
        } catch(error) {
            ctx.body = error;
        }
    },
    async checkScopeByIdentifier(ctx) {
        let formData = ctx.request.body;
        let res = {};
        try{
            let checkScopeByIdentifier_result = await check_scopeByIdentifier(formData);
            res = checkScopeByIdentifier_result;
            ctx.body = res;
        } catch(error) {
            ctx.body = error;
        }
    },
    async introspectAccessToken(ctx) {
        let formData = ctx.request.body;
        let res = {};
        try{
            let introspectAccessToken_result = await introspect_accessToken(formData);
            res = introspectAccessToken_result;
            ctx.body = res;
        } catch(error) {
            ctx.body = error;
        }
    },
    async setParticipantOfIdentifier(ctx) {
        let formData = ctx.request.body;
        let res = {};
        try{
            let setParticipantOfIdentifier_result = await set_ParticipantOfIdentifier(formData);
            res = setParticipantOfIdentifier_result;
            ctx.body = res;
        } catch(error) {
            ctx.body = error;
        }
    },
};