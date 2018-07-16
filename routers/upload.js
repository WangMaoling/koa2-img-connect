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
// const watermarkImg = images('public/images/icon.jpg');
// 压缩文件
const compressing = require('compressing');
function readFileList(path, filesList) {
    // console.log(233)
    var files = fs.readdirSync(path);
    files.forEach(function (itm, index) {
        var stat = fs.statSync(path + itm);
        if (stat.isDirectory()) {
            //递归读取文件
            readFileList(path + itm + "/", filesList)
        } else {
            var obj = {};//定义一个对象存放文件的路径和名字
            obj.path = path;//路径
            obj.filename = itm//名字
            filesList.push(obj);
        }
    })
}
var getFiles = {
    //获取文件夹下的所有文件
    getFileList: function (path) {
        var filesList = [];
        readFileList(path, filesList);
        return filesList;
    },
    //获取文件夹下的所有图片
    getImageFiles: function (path) {
        // console.log(222)
        var imageList = [];
        this.getFileList(path).forEach((item) => {
            var ms = imageInfo(fs.readFileSync(item.path + item.filename));
 
            ms.mimeType && (imageList.push(item.filename))
        });
        return imageList;
    }
};
// var photos = getFiles.getImageFiles(publicFileName+"/");
function suiyin(pathStr){
    var photos = getFiles.getImageFiles(pathStr+"/");
    // console.log(photos)
    var watermarkImg = '';
    for (var i = 0; i < photos.length; i++) {
        console.log(photos[i])
        if(photos[i].split('.')[0] =='s_y'){
            console.log(pathStr+'/'+photos[i])
            watermarkImg = images(pathStr+'/'+photos[i]);
        }
    }
    for (var i = 0; i < photos.length; i++) {
        if(photos[i].split('.')[0] !='s_y'){
            var sourceImg = images(pathStr+"/"+photos[i]);
            var sourceImgName = photos[i];
            var sWidth = sourceImg.width();
            var sHeight = sourceImg.height();
            var wmWidth = watermarkImg.width();
            var wmHeight = watermarkImg.height();
            images(sourceImg)
            // 设置绘制的坐标位置，右下角距离 40px  距离左，距离上
            .draw(watermarkImg, 0, 0)
            .save(pathStr+"_1/"+ sourceImgName+'');
        }
    }
    // 压缩是可行的
    // async function main() {
    //     try {
    //       await compressing.tar.compressDir(pathStr+"_1/", 
    //       pathStr+"_1.tar");
    //       await compressing.gzip.compressFile(pathStr+"_1.tar", 
    //       pathStr+"_1.tgz");
    //       console.log('success');
    //     } catch (err) {
    //       console.error(err);
    //     }
    // }
    // main();
}
const storage = multer.diskStorage({
// const publicFileName = 
    destination:'public/uploads/' + new Date().getFullYear() + (new Date().getMonth() + 1) + new Date().getDate()+'_'+new Date().getTime(),
    // 修改了文件名字
    // filename(ctx, file, cb) {
    //     const filenameArr = file.originalname.split('.');
    //     cb(null, Date.now() + '.' + filenameArr[filenameArr.length - 1]);
    // }
    // 不修改名字
    filename(ctx, file, cb) {
        // console.log(file)
        // console.log(11)
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
router.post('/upload', upload.array('file',20), async (ctx) => {
    // destination
    // upload.array('shuifile');
    if(ctx.req.files){
    // ctx.req.files.destination
    // console.log(ctx.req.files[0].destination)
        fs.mkdir(ctx.req.files[0].destination+'_1')
        suiyin(ctx.req.files[0].destination);
        ctx.body = {
            code:200,
            file:ctx.req.files,
        }
    }else{
        ctx.body = {
            code:201,
            file:'',
        }
    }
   
});
const send = require('koa-send');
const archiver = require('archiver');
router.post('/downloadAll', async (ctx) =>{
    // 将要打包的文件列表
    console.log(ctx.request.body.path)
    var psth = ctx.request.body.path;
    try {
        await compressing.tar.compressDir(psth+"_1/", psth+"_1.tar");
        await compressing.gzip.compressFile(psth+"_1.tar", psth+"_1.zip");
        ctx.body = {
            code:200,
            file:psth+"_1.zip",
        }
    } catch (err) {
        ctx.body = {
            code:201,
            file:'',
        }
    }
})
module.exports = router