var express = require("express");
var router = express.Router();
var cors = require('cors');
router.use(cors());
var bodyParser = require("body-parser");
var SequencesModel = require('../../models/mongoose/sequences');


//delete by id
router.post("/:_id", bodyParser.json(), async function(req, res, next) {
  let _id = req.params._id
  let result = {};
  if(_id !== process.env.admin_id){
    result =  await SequencesModel.findByIdAndDelete(_id).exec();
  }
  return res.send(result);
  });
  
    

module.exports = router;
