import Document from '../models/documentSchema.js';



// const multer = require('multer');
//const upload = multer ({dest: 'documents-upload/'});

 const storage = multer.diskStorage({
    destination:function (req,res,cb){
        cb(null,'/uploads')
    },
    filename:function (req,file,cb){
        const uniqueSuffix=Date.now()+'-'+ Math.round(Math.random()*1E9);
    //cb(null,file.filename+'-'+ uniqueSuffix)
    cb(null,file.originalname);
    }
 });

const upload = multer({ storage});
