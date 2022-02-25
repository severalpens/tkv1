const express = require("express");
const router = express.Router();
const cors = require('cors');
router.use(cors());
const bodyParser = require("body-parser");
router.use(express.json({limit: '50mb'}));
router.use(express.urlencoded({limit: '50mb',extended: false}));
router.use(bodyParser.json({extended: false}));
const LogsModel = require("../../models/mongoose/logs");


router.get("/:seq_id",  function(req, res, next) {
  let seq_id = req.params.seq_id;
  let user_id = req.user_id;

  const query = LogsModel.find({seq_id,user_id}); 
 // query.or([{ user_id: 'public' }, { user_id: req.user_id }])
  query.exec((err, logs) => {
      if (err != null) {
        return res.send(err);
      } 
      else {
        return res.send(logs);
      }
    });
});

router.get("/delete/:seq_id/:_id", bodyParser.json(),async function(req, res, next) {
  let seq_id = req.params.seq_id;
  let _id = req.params._id;
  let user_id = req.user_id;
  await LogsModel.deleteOne({_id,user_id,seq_id}).exec();
  let logs = await LogsModel.find({seq_id, user_id}).exec();
  res.send(logs)

});

  


module.exports = router;
