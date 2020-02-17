const registerResourceSet = require('../models/resource_management/register');
const checkIdentifier = require('../models/resource_management/checkIdentifier');
const checkScope = require('../models/resource_management/checkScope');

module.exports = {
    async registerResourceSet(ctx) {
        let formData = ctx.request.body;
        let res = {};
        try {
            let deploy_result = await registerResourceSet(formData);
            res = deploy_result;
            ctx.body = res;
        } catch(error) {
            ctx.body = error;
        }
    },
    async checkIdentifier(ctx) {
        let formData = ctx.request.body;
        let res = {};
        try {
            let checkIdentifier_result =  await checkIdentifier(formData);
            res = checkIdentifier_result;
            ctx.body = res;
        } catch(error) {
            ctx.body = error;
        }
    },
    async checkScope(ctx) {
        let formData = ctx.request.body;
        let res = {};
        try {
            let checkScope_result =  await checkScope(formData);
            res = checkScope_result;
            ctx.body = res;
        } catch(error) {
            ctx.body = error;
        }
    },

};
