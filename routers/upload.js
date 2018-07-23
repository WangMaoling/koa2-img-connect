const router = require('koa-router')();
const controller = require('../controller/c-upload')
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
var weizhi = '';//定义水印位置
function readFileList(path, filesList) {
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
        var imageList = [];
        this.getFileList(path).forEach((item) => {
            var ms = imageInfo(fs.readFileSync(item.path + item.filename));
 
            ms.mimeType && (imageList.push(item.filename))
        });
        return imageList;
    }
};
function suiyin(pathStr){
    var photos = getFiles.getImageFiles(pathStr+"/");
    var watermarkImg = '';//拿到水印图片
    // console.log(weizhi)
    var tabIndex = Number(weizhi.tabIndex);
    var top = Number(weizhi.top?weizhi.top.split('%')[0]:"");
    var left = Number(weizhi.left?weizhi.left.split('%')[0]:"");
    var right = Number(weizhi.right?weizhi.right.split('%')[0]:"");
    var bottom = Number(weizhi.bottom?weizhi.bottom.split('%')[0]:"");
    // console.log(tabIndex)
    // console.log(top)
    // console.log(left)
    // console.log(right)
    // console.log(bottom)
    for (var i = 0; i < photos.length; i++) {
        if(photos[i].split('.')[0] =='s_y'){
            watermarkImg = images(pathStr+'/'+photos[i]);//拿到水印图片
        }
    }
    for (var i = 0; i < photos.length; i++) {
        if(photos[i].split('.')[0] !='s_y'){
            // 过滤掉水印图片进行 添加水印
            var sourceImg = images(pathStr+"/"+photos[i]);
            var sourceImgName = photos[i];
            var sWidth = sourceImg.width();//原图片宽
            var sHeight = sourceImg.height();//原图片高
            var wmWidth = watermarkImg.width();//水印宽
            var wmHeight = watermarkImg.height();//水印高
            // images(sourceImg)
            // //// 设置绘制的坐标位置，右下角距离 40px  距离左，距离上
            // .draw(watermarkImg, 0, 0)
            // .save(pathStr+"_1/"+ sourceImgName+'');
            switch(tabIndex){
                case 0://左上
                    //把百分比修改为像素 
                    images(sourceImg)
                    .draw(watermarkImg, sWidth*(left/100), sHeight*(top/100))
                    .save(pathStr+"_1/"+ sourceImgName+'');
                    break;
                case 1://右上
                    images(sourceImg)
                    .draw(watermarkImg, sWidth-sWidth*(right/100)-wmWidth, sHeight*(top/100))
                    .save(pathStr+"_1/"+ sourceImgName+'');
                    break;
                case 2://左下
                    images(sourceImg)
                    .draw(watermarkImg, sWidth*(left/100), sHeight-sHeight*(bottom/100)-wmHeight)
                    .save(pathStr+"_1/"+ sourceImgName+'');
                    break;
                case 3://右下
                    images(sourceImg)
                    .draw(watermarkImg, sWidth-sWidth*(right/100)-wmWidth, sHeight-sHeight*(bottom/100)-wmHeight)
                    .save(pathStr+"_1/"+ sourceImgName+'');
                    break;
                case 4://上下居中
                    var wz = 0;
                    if(left>0){
                        // 距离左
                        wz = sWidth*(left/100);
                        images(sourceImg)
                        .draw(watermarkImg, wz, (sHeight-wmHeight)/2)
                        .save(pathStr+"_1/"+ sourceImgName+'');
                    }else if(right>0){
                        // 距离右
                        wz = sWidth-sWidth*(right/100)-wmWidth;
                        images(sourceImg)
                        .draw(watermarkImg, wz, (sHeight-wmHeight)/2)
                        .save(pathStr+"_1/"+ sourceImgName+'');
                    }
                    break;
                case 5://左右居中
                    var wz = 0;
                    if(top>0){
                        // 距离上
                        wz = sHeight*(top/100);
                        images(sourceImg)
                        .draw(watermarkImg, (sWidth-wmWidth)/2,wz)
                        .save(pathStr+"_1/"+ sourceImgName+'');
                    }else if(bottom>0){
                        // 距离下
                        wz = sHeight-sHeight*(bottom/100)-wmHeight;
                        images(sourceImg)
                        .draw(watermarkImg, (sWidth-wmWidth)/2,wz)
                        .save(pathStr+"_1/"+ sourceImgName+'');
                    }
                    break;
                case 6://全部居中
                    images(sourceImg)
                    .draw(watermarkImg, (sWidth-wmWidth)/2,(sHeight-wmHeight)/2)
                    .save(pathStr+"_1/"+ sourceImgName+'');
                    break;
                default:;
            }
        }
    }
}
const storage = multer.diskStorage({
    destination:'public/uploads/' + new Date().getFullYear() + (new Date().getMonth() + 1) + new Date().getDate()+'_'+new Date().getTime(),
    filename(ctx, file, cb) {
        const filenameArr = file.originalname.split('.');
        cb(null,file.originalname);
    }
});
const upload = multer({
    storage
});
router.get('/', controller.getRedirectPosts)
router.get('/test', controller.getTest)
router.post('/upload', upload.array('file',20), async (ctx) => {
    if(ctx.req.files){
        weizhi = JSON.parse(ctx.req.body.weizhi);
        // 判断是否存在文件夹如果存在说明，是刚被创建好的，就不需要在创建了
        fs.exists(ctx.req.files[0].destination+'_1',function(exists){
            if(exists==false){
                // 创建新文件夹
                fs.mkdir(ctx.req.files[0].destination+'_1');
                suiyin(ctx.req.files[0].destination)
            }else{
                suiyin(ctx.req.files[0].destination);
            }
        })
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
router.post('/downloadAll', async (ctx) =>{
    //点击下载调用接口打包，传过来要打包的文件路径 将要打包的文件列表
    // console.log(ctx.request.body.path)
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