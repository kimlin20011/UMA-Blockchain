const requestResource = require('../models/offchain/requestResource');


module.exports = {
/*    async requestResource(ctx) {
        let formData = ctx.request.body;
        let res = {};
        let getResourceSet_result =  await requestResource(formData);
        res = getResourceSet_result;
        ctx.body = res;
    },*/
    async requestResource(ctx) {
        let formData = ctx.request.body;
        let res = {};
        //let data = {};
        //data = ctx.request.body;
        //data.auth_dur = ctx.request.body.auth_dur;
        try {
            res =  await requestResource(formData);
            ///
           /* data.identifier = res.info[0].identifier;
            data.rqpAddress= formData.rqpAddress;
            data.info  = res;*/
            //在這裏不能用redirect，會回傳原本IP所帶有的body，要在module裡面直接包含post方法
            //另外需要先從資料庫中取得auth contract address後，在一併傳給送出http request
            //重新定向
            // 308 is post
            //console.log(`redirecting to /auth/generateTicket`);
            //ctx.status = 308;
            ctx.body = res;
          //  ctx.redirect('/auth/generateTicket');
        }catch(error) {
            ctx.body = error;
        }
    },

};
