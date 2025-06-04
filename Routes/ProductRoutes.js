var express=require('express')
var router=express.Router();
var ProductController=require('../Controllers/ProductController')

router.post('/register/:id',ProductController.upload.single('image'),ProductController.addprod)

router.delete('/delete/:id',ProductController.removeprod)

router.get('/uploads/:imageName', (req, res) => {
    const imageName = req.params.imageName;
    res.header('Content-Type', 'image/jpeg');
    res.sendFile(path.join(__dirname, '..', 'uploads', imageName));
});
module.exports=router;