const encryp_token = require('../models/request_party/encryptToken');

module.exports = {
    async encryptToken(ctx) {
        let formData = ctx.request.body;
        let res = {};
        let encryptToken_result =  await encryp_token(formData);
        res = encryptToken_result;
        ctx.body = res;
    },
};