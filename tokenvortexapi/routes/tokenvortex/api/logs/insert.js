var express = require("express");
var router = express.Router();
var cors = require('cors');
router.use(cors());
var bodyParser = require("body-parser");
var LogsModel = require('../../models/mongoose/logs');



router.post("/", bodyParser.json(), function(req, res, next) {
  let log = req.body;
  LogsModel.create(log).then(result => {
    res.send(result);
  });
});

module.exports = router;
