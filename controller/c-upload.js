
//引用文件系统模块
const fs = require("fs");
/**
 * 重置到首页
 */
exports.getRedirectPosts = async ctx => {
    ctx.redirect('/test')
}
exports.getTest = async ctx => {
    await ctx.render('test.html', {
        session: ctx.session,
    })
}
// 上传图片接口 在路由文件里面写了
// exports.postUpload = async (ctx, next)  => {
//     try {
//         ctx.body = {
//             status: true,
//             info: ctx.request.body.fields 
//         }
//     } catch (err) {
//         ctx.body = {
//             status: false,
//             info: err.message,
//         }
//     }
// }