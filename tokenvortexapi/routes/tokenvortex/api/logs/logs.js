var express = require("express");
var router = express.Router();
var cors = require('cors');
router.use(cors());

var bodyParser = require("body-parser");
var deleteRouter = require("./delete");
var insertRouter = require("./insert");
var updateRouter = require("./update");

router.use('/delete',deleteRouter);
router.use('/insert',insertRouter);
router.use('/update',updateRouter);

var LogsModel = require('../../models/mongoose/logs');


router.get("/:sequence_id", async function(req, res, next) {
  let sequence_id = req.params.sequence_id;
 let logs = await LogsModel.find({sequence_id}).exec(); 
  res.send(logs);
});






module.exports = router;
