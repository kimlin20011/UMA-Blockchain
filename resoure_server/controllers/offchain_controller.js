const requestResource = require('../models/offchain/requestResource');
const introspectAccessToken = require('../models/auth/introspectAccessToken');

module.exports = {
    async requestResource(ctx) {
        let formData = ctx.query;
        let authData = {};
        authData.signature = ctx.headers.authorization;
        authData.token = ctx.headers.token;
        authData.rqpAddress = ctx.query.rqpAddress;
        let res = {};
        // console.log(`signature`);
        // console.log(authData.signature);
        // console.log(`token`);
        // console.log(authData.token);
        if(authData.signature != null){
            try {
                console.log(`introspectAccessToken`);
                res =  await introspectAccessToken(authData);
                ctx.body = res;
            }catch(error) {
                ctx.body = error;
            }
        }else{
            console.log(`get para`);
            console.log(formData);
            try {
                res =  await requestResource(formData);
                ctx.body = res;
            }catch(error) {
                ctx.body = error;
            }
        }

    },

};
