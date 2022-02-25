var express = require("express");
var router = express.Router();
var cors = require('cors');
router.use(cors());
var bodyParser = require("body-parser");
var LogsModel = require('../../models/mongoose/logs');





//delete by id
router.post("/:_id", bodyParser.json(), async function(req, res, next) {
  let _id = req.params._id
  let result = {};
    result =  await LogsModel.findByIdAndDelete(_id).exec();
    let res2 = await LogsModel.find({}).exec();
  return res.send(res2);
  });
  




module.exports = router;
