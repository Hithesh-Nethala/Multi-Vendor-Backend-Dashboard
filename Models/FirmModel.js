var mongoose=require('mongoose');

const Firm=mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    address:{
        type:String,
        required:true
    },
    category:{
        type:[{
            type:String,
            enum:['veg','non-veg']
        }]
    },
    region:{
        type:[{
            type:String,
            enum:['north-indian','south-indian','chinese','bakery']
        }]
    },
    offer:{
        type:String
    },
    image:{
        type:String
    },
    owner:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'ownerdetails'
        }
    ],
    product:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'product'
        }
    ]
})

module.exports=mongoose.model("firm",Firm);