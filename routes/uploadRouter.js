const express = require('express');
const authenticate = require('../authenticate');
const multer = require('multer');

//set up multer storage
const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'public/images');
    },
    filename:(req,file,cb)=>{
        cb(null,file.originalname);
    }
});

//set up 图片/文件上传格式条件
const imageFileFilter = (req,file,cb)=>{
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)){
        return cb(new Error('You can upload only image files!'), false);//if the file doesnot match the extension,则返回错误提示，false并拒绝file
    }
    cb(null,true);//null means there is no err; true means to accept the file
}

//call multer to enable file upload
const upload = multer({storage:storage, fileFilter:imageFileFilter});

const uploadRouter = express.Router();

uploadRouter.route('/')
.get(authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end('GET operation not supported on /imageUpload');
})
.post(authenticate.verifyUser, authenticate.verifyAdmin, upload.single('imageFile'), (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(req.file);//send to client to confirm the file upload successfully
})
.put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /imageUpload');
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end('DELETE operation not supported on /imageUpload');
});

module.exports = uploadRouter;