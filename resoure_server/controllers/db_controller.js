const getResourceSet = require('../models/db/getResourceSet');
const getPolicy = require('../models/db/getPolicy');


module.exports = {
    async getResourceSet(ctx) {
        let formData = ctx.request.body;
        let res = {};
        try {
            let getResourceSet_result =  await getResourceSet(formData);
            res = getResourceSet_result;
            ctx.body = res;
        } catch(error) {
            ctx.body = error;
        }
    },
    async getPolicy(ctx) {
        let formData = ctx.request.body;
        let res = {};
        try {
            let getPolicy_result =  await getPolicy(formData);
            res = getPolicy_result;
            ctx.body = res;
        } catch(error) {
            ctx.body = error;
        }
    },
};
