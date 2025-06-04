var Firm=require('../Models/FirmModel');
var Registration=require('../Models/OwnerModel')
var Productadd=require('../Models/ProductModel');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: 'uploads/', // Folder to store images
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });


const firmRegister=async(req,res)=>{
    const {name,address,offer}=req.body;
    const category=JSON.parse(req.body.category);
    const region=JSON.parse(req.body.region)
    const image=req.file? req.file.filename:undefined;
    try {
        let exist=await Firm.findOne({name:name.toLowerCase()});
        if(exist){
            return res.status(400).json({message:'Name Already Exist'})
        }
        if(!req.user.id){
            return res.status(400).json({message:"Owner Not Found"})
        }

        let ownerexist=await Registration.findById(req.user.id)

        let newData=new Firm({name:name.toLowerCase(),address,category,region,offer,image,owner:ownerexist._id});
        const savedfirm=await newData.save();
        ownerexist.firm.push(savedfirm);
        await ownerexist.save();
        const firmid=savedfirm._id;
        return res.status(200).json({message:'Firm Registered Successfully',firmid})
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

module.exports={firmRegister,upload,firmProducts,firmDelete,firmIndvProducts}