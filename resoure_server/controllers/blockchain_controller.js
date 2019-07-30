const deploy_RM = require('../models/deploy_RM');
const deploy_Auth = require('../models/deploy_Auth');
//const getAccounts = require('../models/getAccounts');

module.exports = {
    async deploy_RM_contract(ctx) {
        // let formData = ctx.request.body
        let res = {};
        let deploy_result =  await deploy_RM();
        res = deploy_result;

        ctx.body = res;
    },
    async deploy_Auth_contract(ctx) {
        let formData = ctx.request.body;
        let res = {};

        let deploy_result =  await deploy_Auth(formData);
        res = deploy_result;

        ctx.body = res;
    },
};
