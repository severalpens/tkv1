var express = require("express");
var router = express.Router();
var cors = require('cors');
router.use(cors());
var bodyParser = require("body-parser");
var SequencesModel = require('../../models/mongoose/sequences');



router.post("/:_id", bodyParser.json(), function(req, res, next) {
  let _id = req.params._id;
  let sequence = req.body;
  sequence.user_id = req.user_id;
  if (_id) {
    SequencesModel.updateOne(
      { _id }, sequence ,
      function(err, result) {
        if(err){res.send(err)}
        res.send([req.body, result]);
      }
    );
  }
});





module.exports = router;
