const getResourceSet = require('../models/db/getResourceSet');


module.exports = {
    async getResourceSet(ctx) {
        let formData = ctx.request.body;
        let res = {};
        let getResourceSet_result =  await getResourceSet(formData);
        res = getResourceSet_result;
        ctx.body = res;
    },
};
