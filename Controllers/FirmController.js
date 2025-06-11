var Firm=require('../Models/FirmModel');
var Registration=require('../Models/OwnerModel')
var Productadd=require('../Models/ProductModel');
const multer = require('multer');
const path = require('path');
var dotenv=require('dotenv');
const cloudinary=require('cloudinary').v2;

dotenv.config();
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
      { folder: 'firms' },
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


const firmRegister=async(req,res)=>{
    const {name,address,offer}=req.body;
    const category=JSON.parse(req.body.category);
    const region=JSON.parse(req.body.region)
    try {
        let exist=await Firm.findOne({name:name.toLowerCase()});
        if(exist){
            return res.status(400).json({message:'Name Already Exist'})
        }
        if(!req.user.id){
            return res.status(400).json({message:"Owner Not Found"})
        }

        let ownerexist=await Registration.findById(req.user.id)
        let imageUrl=null;
        if(req.file){
            const result = await streamUpload(req.file.buffer);
            imageUrl = result.secure_url;
        }
        let newData=new Firm({name:name.toLowerCase(),address,category,region,offer,image:imageUrl,owner:ownerexist._id});
        const savedfirm=await newData.save();
        ownerexist.firm.push(savedfirm);
        await ownerexist.save();
        const firmid=savedfirm._id;
        const firmname=savedfirm.name;
        return res.status(200).json({message:'Firm Registered Successfully',firmid,firmname})
    } catch (error) {
        return res.status(500).json({message:`${error}`})
        
    }
}

const firmProducts=async(req,res)=>{
    try {
        let exist=await Firm.find();
        if(!exist){
            return res.status(400).json({message:"No Firm Products Fetched"})
        }
        return res.status(200).json(exist);
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"No Products Fetched!"})
    }
}

const firmIndvProducts=async(req,res)=>{
    try {
        let exist=await Firm.findById(req.params.id)
        // console.log(req.params.id)
        if(!exist){
            return res.status(400).json({message:'No Firms Found'})
        }
        const firmname=exist.name;

        const products=await Productadd.find({firm:req.params.id})
        return res.status(200).json({products,firmname});
    } catch (error) {
        return res.status(500).json({message:'Individual Products Not Found'})
    }
}

const firmIndv=async(req,res)=>{
    try {
        let exist=await Registration.findById(req.params.id).populate('firm');
        if(!exist){
            return res.status(400).json({message:'Owner Not Found'})
        }
        if (!exist.firm || exist.firm.length === 0) {
            return res.status(400).json({ message: 'No Firms Found for Owner' });
        }
        const firmid=exist.firm[0]._id||null;
        const firmname=exist.firm[0].name||null
        return res.status(200).json({firmid,firmname})
    } catch (error) {
        return res.status(500).json({message:'Firm Not Retrived'})
    }

}

const firmDelete=async(req,res)=>{
    try {
        let firm_del=await Firm.findByIdAndDelete(req.params.id);
        if(!firm_del){
            return res.status(400).json({message:"Firm Not Found"})
        }
        return res.status(200).json(firm_del);
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:'Firm Not Deleted'})
    }
}

module.exports={firmRegister,upload,firmProducts,firmDelete,firmIndvProducts,firmIndv}
