const userModel = require('../lib/mysql.js')
const moment = require('moment')
const checkNotLogin = require('../middlewares/check.js').checkNotLogin
const checkLogin = require('../middlewares/check.js').checkLogin;
const md = require('markdown-it')();
const multer = require("koa-multer"); //上传图片用
const router = require('koa-router')();


//引用文件系统模块
const fs = require("fs");
//引用imageinfo模块
const imageInfo = require("imageinfo");
//引用images模块
const images = require('images');
// const watermarkImg = images('../public/images/icon.jpg');
/**
 * 重置到文章页
 */
exports.getRedirectPosts = async ctx => {
    ctx.redirect('/test')
}
// 测试页面
exports.getTest = async ctx => {
    // await checkLogin(ctx)//不检查登录状态
    await ctx.render('test.ejs', {
        session: ctx.session,
    })
}
// 上传图片接口
exports.postUpload = async (ctx, next)  => {
    // ctx.body = {
    //     code: 500,
    //     message: '发表文章失败'
    // }
    try {
        ctx.body = {
            status: true,
            info: ctx.request.body.fields 
        }
    } catch (err) {
        ctx.body = {
            status: false,
            info: err.message,
        }
    }
    // return next;
}