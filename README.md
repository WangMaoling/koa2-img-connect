# node Koa2 批量配置图片添加水印
#### 本来打算上传到阿里云服务器 但是 node-images不支持centos系统，找了好久也没有找到好的解决方案，用gm也没有在服务器上跑起来。哪位若是有好的想法可以给我留言，非常感谢。


处理图片过程：
上传时multer会在服务端新建一个文件夹存储图片包括水印图片，上传成功后返回给前端图片存放的路径（这个路径需要下载的时候在传回后端，前端需要保存这个路径）回调一个添加水印的方法，用images添加水印，然后根据之前新建的文件夹名称在新建一个新的处理好的图片集合的文件夹。
最后前台点击下载的时候把要下载的文件夹传回后端，后端处理好图片的文件夹打包成压缩包返回过去。

$ npm install

$ npm install supervisor --save (安装修改node代码，立马刷新后台插件)

$ npm run dev(运行项目，此运次方法可以实时运行更新后台代码)
或者
$ node index.js

![image](https://github.com/WangMaoling/koa2-img-connect/blob/master/public/images/WX20180723-171952%402x.png)

![image](https://github.com/WangMaoling/koa2-img-connect/blob/master/public/images/2.jpeg)

