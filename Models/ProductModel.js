var mongoose=require('mongoose');

const Productadd=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    price:{
        type:String,
        required:true
    },
    category:{
        type:[{
            type:String,
            enum:['veg','non-veg']
        }]
    },
    image:{
        type:String,
    },
    bestseller:{
        type:[{
            type:String,
            enum:['yes','no']
        }]
    },
    description:{
        type:String,
    },
    firm:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"firm"
        }
    ]

})
module.exports=mongoose.model('product',Productadd)