var Productadd=require('../Models/ProductModel');
var Firm=require('../Models/FirmModel');
const multer = require('multer');
var dotenv=require('dotenv')
const cloudinary=require('cloudinary').v2;
dotenv.config();
// const storage = multer.diskStorage({
//     destination: 'uploads/', // Folder to store images
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + path.extname(file.originalname));
//     }
// });
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
});

const storage=multer.memoryStorage();

const upload = multer({ storage: storage });

const streamUpload = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'products' },
      (error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    );
    stream.end(fileBuffer);
  });
};


const addprod=async(req,res)=>{
    const {name,price,bestseller,description}=req.body;
    const category=JSON.parse(req.body.category);
    try {
        // const image=req.file? req.file.filename:undefined;
        let exist=await Firm.findById(req.params.id);
        if(!exist){
            return res.status(400).json({message:"Firm Not Found"})
        }
        let imageUrl=null;
        if(req.file){
            const result=await streamUpload(req.file.buffer);
            imageUrl=result.secure_url
        }
        let newData=new Productadd({name,price,category,image:imageUrl,bestseller,description,firm:exist._id});
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