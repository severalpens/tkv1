var express = require("express");
var router = express.Router();
var cors = require('cors');
router.use(cors());
var bodyParser = require("body-parser");
var EntitiesModel = require('../../models/mongoose/entities');
const functions = require('./functions');

router.post("/", bodyParser.json(), function (req, res, next) {
  let entity = req.body;
  entity.user_id = req.user_id;
  delete entity._id;
  
  entity.isActive = true;
  entity = functions.customise(entity);
  EntitiesModel.create(entity).then(result => {
    res.send(result);
  });
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


