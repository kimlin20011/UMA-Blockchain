const registerResourceSet = require('../models/register');

//const getAccounts = require('../models/getAccounts');

module.exports = {
    async registerResourceSet(ctx) {
        let formData = ctx.request.body;
        let res = {};
        let deploy_result =  await registerResourceSet(formData);
        res = deploy_result;
        ctx.body = res;
    },
};
