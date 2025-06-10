var express=require('express');
var app=express();
var mongoose=require('mongoose');
var dotenv=require('dotenv')
var ownerrouter=require('./Routes/OwnerRoutes')
var firmrouter=require('./Routes/FirmRoutes')
var productrouter=require('./Routes/ProductRoutes')
var cors=require('cors')
dotenv.config();

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log('Database Connected!!!'))
.catch((err)=>console.log(err))

app.use(express.json());
app.use(cors({origin:'*'}))

app.use('/owner',ownerrouter);

app.use('/firm',firmrouter);

app.use('/product',productrouter);


app.use('/',(req,res)=>{
    res.send('Server Up !!!');
})

// var port=5000;
const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>console.log(`Server running on port ${PORT}`));