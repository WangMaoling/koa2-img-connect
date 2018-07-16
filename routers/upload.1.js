const router = require('koa-router')();
const controller = require('../controller/c-upload')
const koaBody = require('koa-body')
const multer = require("koa-multer"); //上传图片用

//引用文件系统模块
const fs = require("fs");
//引用imageinfo模块
const imageInfo = require("imageinfo");
//引用images模块
const images = require('images');
const watermarkImg = images('public/images/icon.jpg');

const storage = multer.diskStorage({
    destination: 'public/uploads/' + new Date().getFullYear() + (new Date().getMonth() + 1) + new Date().getDate(),
    // 修改了文件名字
    // filename(ctx, file, cb) {
    //     const filenameArr = file.originalname.split('.');
    //     cb(null, Date.now() + '.' + filenameArr[filenameArr.length - 1]);
    // }
    // 不修改名字
    filename(ctx, file, cb) {
        // var sourceImg = images(ctx.req.file);
        // var sWidth = sourceImg.width();
        // var sHeight = sourceImg.height();
        // var wmWidth = watermarkImg.width();
        // var wmHeight = watermarkImg.height();
        // console.log(wmHeight)
        // console.log(sourceImg)

        // images(sourceImg)
        // 设置绘制的坐标位置，右下角距离 40px  距离左，距离上
        // .draw(watermarkImg, 0, 0)
        const filenameArr = file.originalname.split('.');
        cb(null,file.originalname);
    }
});
const upload = multer({
    storage
});

router.get('/', controller.getRedirectPosts)
router.get('/test', controller.getTest)
// router.post('/upload',upload.single('picture'),controller.postUpload)
router.post('/upload', upload.single('file'), async (ctx) => {
    if(ctx.req.file){
        ctx.body = {
            code:200,
            file:ctx.req.file,
        }
    }else{
        ctx.body = {
            code:201,
            file:'',
        }
    }
   
});

module.exports = router