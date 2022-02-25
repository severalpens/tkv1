var express = require("express");
var router = express.Router();
var cors = require('cors');
router.use(cors());
var bodyParser = require("body-parser");
var SequencesModel = require('../../models/mongoose/sequences');



router.post("/", bodyParser.json(), function(req, res, next) {
  let sequence = req.body;
  sequence.user_id = req.user_id;
  sequence.isActive = true;
  SequencesModel.create(sequence).then(result => {
    res.send(result);
  });
});

module.exports = router;
