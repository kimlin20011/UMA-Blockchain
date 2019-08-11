const getResourceSet = require('../models/db/getResourceSet');
const getPolicy = require('../models/db/getPolicy');


module.exports = {
    async getResourceSet(ctx) {
        let formData = ctx.request.body;
        let res = {};
        let getResourceSet_result =  await getResourceSet(formData);
        res = getResourceSet_result;
        ctx.body = res;
    },
    async getPolicy(ctx) {
        let formData = ctx.request.body;
        let res = {};
        let getPolicy_result =  await getPolicy(formData);
        res = getPolicy_result;
        ctx.body = res;
    },
};
