var express = require("express");
var router = express.Router();
var cors = require('cors');
router.use(cors());
var bodyParser = require("body-parser");
var StepsModel = require('../../models/mongoose/steps');

router.post("/", bodyParser.json(), function(req, res, next) {
  let step = req.body;
  step.user_id = req.user_id;
  StepsModel.create(step).then(result => {
    res.send(result);
  });
});

module.exports = router;
