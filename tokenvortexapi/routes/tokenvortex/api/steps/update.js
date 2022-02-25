var express = require("express");
var router = express.Router();
var cors = require('cors');
router.use(cors());
var bodyParser = require("body-parser");
var StepsModel = require('../../models/mongoose/steps');

router.post("/:_id", bodyParser.json(), function(req, res, next) {
  let _id = req.params._id;
  let step = req.body;
  step.user_id = req.user_id;

  if (_id) {
    StepsModel.updateOne(
      { _id },
      step,
      function(err, result) {
        if(err){res.send(err)}
        res.send([req.body, result]);
      }
    );
  }
});





module.exports = router;
