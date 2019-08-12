const deploy_RM = require('../models/deploy_RM');
const deploy_Auth = require('../models/deploy_Auth');
const getAccounts = require('../models/getAccounts');

module.exports = {
    async deploy_RM_contract(ctx) {
        let formData = ctx.request.body
        let res = {};
        try{
            let deploy_result =  await deploy_RM(formData);
            res = deploy_result;
            ctx.body = res;
        } catch(error) {
            ctx.body = error;
        }
    },
    async deploy_Auth_contract(ctx) {
        let formData = ctx.request.body;
        let res = {};
        try{
            let deploy_result =  await deploy_Auth(formData);
            res = deploy_result;
            ctx.body = res;
        } catch(error) {
            ctx.body = error;
        }
    },
    async getAccounts(ctx) {
        // let formData = ctx.request.body
        try{
            let accounts =  await getAccounts();
            ctx.body = accounts;
        } catch(error) {
            ctx.body = error;
        }
    },
};
