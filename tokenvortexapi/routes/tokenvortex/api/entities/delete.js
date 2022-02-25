var express = require("express");
var router = express.Router();
var cors = require('cors');
router.use(cors());
var bodyParser = require("body-parser");
var EntitiesModel = require('../../models/mongoose/entities');


//delete by id
router.post("/:_id", bodyParser.json(), async function(req, res, next) {
  let _id = req.params._id
  let result = {};
  if(_id !== process.env.admin_id){
    result =  await EntitiesModel.findByIdAndDelete(_id).exec();
  }
  return res.send(result);
  });
  
    
//soft delete
  router.post("/soft/:_id", bodyParser.json(),async  function(req, res, next) {
    let _id = req.params._id;
    if(_id !== process.env.admin_id){
      EntitiesModel.updateOne({ _id }, { isActive: false }).then(result => {
      return res.send(result);
    });
  }
  });
  

    
//delete and return the rest
router.post("/return/:_id", bodyParser.json(),async  function(req, res, next) {
  let _id = req.params._id;
  let user_id = req.user_id;
  if(_id !== process.env.admin_id){

  await EntitiesModel.deleteOne({ _id}).exec();
  let entities = EntitiesModel.find({user_id}).exec();
  res.send(entities);
  }
});

module.exports = router;
