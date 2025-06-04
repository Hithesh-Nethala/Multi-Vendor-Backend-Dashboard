var Productadd=require('../Models/ProductModel');
var Firm=require('../Models/FirmModel');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: 'uploads/', // Folder to store images
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

const addprod=async(req,res)=>{
    const {name,price,bestseller,description}=req.body;
    const category=JSON.parse(req.body.category);
    try {
        const image=req.file? req.file.filename:undefined;
        let exist=await Firm.findById(req.params.id);
        if(!exist){
            return res.status(400).json({message:"Firm Not Found"})
        }
        let newData=new Productadd({name,price,category,image,bestseller,description,firm:exist._id});
        const productsaved=await newData.save();
        exist.product.push(productsaved);
        await exist.save();
        return res.status(200).json({message:'Product Added'})

    } catch (error) {
        console.log(error);
        return res.status(500).json({message:'Product not added'})
    }
}

const removeprod=async(req,res)=>{
    try {
        const removeitem=await Productadd.findByIdAndDelete(req.params.id);
        if(!removeitem){
            return res.status(400).json({message:"Product Not Found"})
        }
        return res.status(200).json(removeitem);
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:'Product Not Removed'})
    }
}
module.exports={addprod,upload,removeprod}