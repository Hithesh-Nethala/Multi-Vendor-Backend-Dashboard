var jwt =require('jsonwebtoken');
var dotenv=require('dotenv')
module.exports =function(req,res,next){
    try {
        let token=req.header('x-token');
        if(!token){
            return res.status(400).json({message:"Token not recived"})
        }
        dotenv.config();
        let decode=jwt.verify(token,process.env.secretkey)
        req.user=decode.user;
        next();
    } catch (error) {
        return res.status(500).json({message:'Invalid Token'+`${error}`})
    }
}