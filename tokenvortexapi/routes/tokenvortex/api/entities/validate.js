var express = require("express");
var router = express.Router();
var cors = require('cors');
router.use(cors());
var bodyParser = require("body-parser");
var EntitiesModel = require('../../models/mongoose/entities');
const crypto = require('crypto');
const ethers = require('ethers');
const functions = require('./functions');
const admin_id = '5f8f88e5d28b37394459bbba';



router.post("/account", bodyParser.json(), function (req, res, next) {
  let account = req.body;
  account.user_id = req.user_id;
  let result = functions.validateAccount(account);
  if(result){
    console.log('all good');
    res.json('all good');
  }
  else{
    console.log('problems');
    res.json('problems');
  }
});



module.exports = router;


// router.post("/v2", bodyParser.json(), function(req, res, next) {
//   let entity = req.body;
//   entity.user_id = req.user_id;
//   entity.isActive = true;
//   entity = customise(entity);
//   EntitiesModel.save((err,result) => {
//     if(err){
//       console.log(err);
//       res.send(err);
//     }
//     console.log(result);
//     res.send(result);
//   })
// });


