var ethers = require("ethers");
var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");
var SequencesModel = require("../../models/mongoose/sequences");
var EntitiesModel = require("../../models/mongoose/entities");
var mongoose = require('mongoose');
const LogsModel = require("../../models/mongoose/logs");
var router = express.Router();
router.use(cors());
router.use(bodyParser.json());
router.use(express.json({ limit: '50mb' }));
router.use(express.urlencoded({ limit: '50mb', extended: false }));
router.use(bodyParser.json({ extended: false }));

router.get("/:_id", async function (req, res) {
  let _id = req.params._id;
  let sequence = await SequencesModel.findById(_id).lean().exec();
  sequence.posId = 0;
  sequence.steps.forEach((step, i) => {
    sequence.steps[i].status = null;
  });

 await SequencesModel.findByIdAndUpdate(sequence._id,sequence,{useFindAndModify: false})
 let result = await SequencesModel.findById(_id).exec();
  res.send(result);
});


module.exports = router;
