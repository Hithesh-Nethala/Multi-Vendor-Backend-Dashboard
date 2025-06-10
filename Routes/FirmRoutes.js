var express=require('express');
var FirmController=require('../Controllers/FirmController')
var router=express.Router();
var middleware=require('../Middleware/middleware')
var path=require('path')
router.post('/register',middleware,FirmController.upload.single('image'),FirmController.firmRegister)

router.get('/allproducts',middleware,FirmController.firmProducts)

router.get('/indvproducts/:id',middleware,FirmController.firmIndvProducts)

router.get('/indv/:id',FirmController.firmIndv)

router.delete('/delete/:id',middleware,FirmController.firmDelete)

router.get('/uploads/:imageName', (req, res) => {
    const imageName = req.params.imageName;
    res.header('Content-Type', 'image/jpeg');
    res.sendFile(path.join(__dirname, '..', 'uploads', imageName));
});
module.exports=router;

