var bcrypt=require('bcryptjs');
var jwt=require('jsonwebtoken');
var Registration=require('../Models/OwnerModel');
var Firm=require('../Models/FirmModel');
var Productadd=require('../Models/ProductModel')
const ownerRegister=async(req,res)=>{
    const{name,email,number,password,confirmpassword}=req.body;
    try {
        let exist=await Registration.findOne({email:email});
        if(exist){
            return res.status(400).json({message:'Email Already Exists!'})
        }
        if(password!==confirmpassword){
           return res.status(400).json({message:'Password & Confirm Password should be same'})
        }
        const hashedpassword=await bcrypt.hash(password,10);
        const newData=new Registration({name,email,number,password:hashedpassword,confirmpassword});
        await newData.save();
        // console.log('Registration Successfull.')
        return res.status(200).json({message:"Registration Successfull"})
    } catch (error) {
        return res.status(500).json({message:error})
    }
}

const ownerLogin=async(req,res)=>{
    const {email,password}=req.body;
    try {
        let exist=await Registration.findOne({email:email})
        if(!exist){
            return res.status(400).json({message:'User not exist'})
        }
        if(! await bcrypt.compare(password, exist.password)){
            return res.status(400).json({message:'Password Incorrect'})
        }
        const ownerid=exist._id;
        let payload={
            user:{
                id:exist._id
            }
        }
        const key=process.env.secretkey;
        jwt.sign(payload,key,{expiresIn:'1h'},(err,token)=>{
            if(err){
                return res.status(400).json({message:err})
            }
            return res.status(200).json({ownerid,token,message:'Login Successfull'})
        })
    } catch (error) {
        return res.status(500).json({message:'Login Failed'})
        
    }
}

const allOwners=async(req,res)=>{
    try {
        let exist=await Registration.find().populate('firm');
        if(!exist){
            return res.status(400).json({message:"No Owners Existed in DB"})
        }
        return res.status(200).json(exist);
    } catch (error) {
        return res.status(500).json({message:'Getting All Owners Failed'})
    }
}

const indvOwner=async(req,res)=>{
    try {
        let exist=await Registration.findById(req.params.id).populate('firm')
        if(!exist){
            return res.status(400).json({message:"Owner Not Existed In DB"})
        }
        const ownername=exist.name;
        const firmid=exist.firm[0]._id
        const firmname=exist.firm[0].name;
        if(!firmid){
            return res.status(400).json({message:'No Firm Found'})
        }
        return res.status(200).json({firmid,ownername,firmname});
    } catch (error) {
        return res.status(500).json({message:'Getting Owner Failed'})
    }
}
module.exports={ownerRegister,ownerLogin,allOwners,indvOwner};
