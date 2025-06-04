var express=require('express');
var router=express.Router();
var OwnerController=require('../Controllers/OwnerController');

router.post('/register',OwnerController.ownerRegister);
router.post('/login',OwnerController.ownerLogin);
router.get('/allowners',OwnerController.allOwners);
router.get('/indvowner/:id',OwnerController.indvOwner);
module.exports=router;

