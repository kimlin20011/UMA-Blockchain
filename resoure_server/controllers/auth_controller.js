const set_Policy = require('../models/auth/setPolicy');
const set_Scopeindividual = require('../models/auth/setScopeindividual');
const generate_Ticket = require('../models/auth/generateTicket');

module.exports = {
    async setPolicy(ctx) {
        let formData = ctx.request.body;
        let res = {};
        let setPolicy_result = await set_Policy(formData);
        res = setPolicy_result;
        ctx.body = res;
    },
    async setScopeindividual(ctx) {
        let formData = ctx.request.body;
        let res = {};
        let setScopeindividual_result = await set_Scopeindividual(formData);
        res = setScopeindividual_result;
        ctx.body = res;
    },
    async generateTicket(ctx) {
        let formData = ctx.request.body;
        let res = {};
        let generateTicket_result = await generate_Ticket(formData);
        res = generateTicket_result;
        ctx.body = res;
    },
}