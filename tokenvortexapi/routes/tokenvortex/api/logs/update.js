var express = require("express");
var router = express.Router();
var cors = require('cors');
router.use(cors());
var bodyParser = require("body-parser");
var LogsModel = require('../../models/mongoose/logs');



router.post("/:_id", bodyParser.json(), function(req, res, next) {
  let _id = req.params._id;
  let log = req.body;
  LogsModel.update({_id},log)
});





module.exports = router;
