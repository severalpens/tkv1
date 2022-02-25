var express = require("express");
var router = express.Router();
var cors = require('cors');
router.use(cors());
var bodyParser = require("body-parser");
var BtcModel = require('../../../models/mongoose/btc');

router.post("/:_id", bodyParser.json(), async function (req, res, next) {
  let entity = req.body;
  entity.user_id = req.user_id;
  if(entity._id !== process.env.admin_id){
    BtcModel.updateOne(
      { 
        _id: req.params._id, 
        user_id: req.user_id
       },
      entity,
    )
    .exec((err,result) => {
      if(err){
        console.log(err);
        res.send(err)
      }
      console.log(result);
      res.send(result)
    });
  }
});


module.exports = router;
