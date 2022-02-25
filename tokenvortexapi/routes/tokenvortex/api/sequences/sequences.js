var express = require("express");
var router = express.Router();
var cors = require('cors');
router.use(cors());
var bodyParser = require("body-parser");
var deleteRouter = require("./delete");
var truncateRouter = require("./truncate");
var insertRouter = require("./insert");
var updateRouter = require("./update");
var lockRouter = require("./lock");
var runRouter = require("./run");
var resetRouter = require("./reset");
var ethRouter = require("./eth");
var tokenRouter = require("./token")
var logsRouter = require("./logs");

router.use('/lock',lockRouter);
router.use('/delete',deleteRouter);
router.use('/truncate',truncateRouter);
router.use('/insert',insertRouter);
router.use('/update',updateRouter);
router.use('/run',runRouter);
router.use('/reset',resetRouter);
router.use('/eth',ethRouter);
router.use('/token',tokenRouter);
router.use('/logs',logsRouter);

var SequencesModel = require('../../models/mongoose/sequences');


router.get("/",  function(req, res, next) {
  const query = SequencesModel.find(); 
  query.setOptions({ lean : true });
  query.collection(SequencesModel.collection)
  query.or([{ user_id: 'public' }, { user_id: req.user_id }])
  query.exec((err, sequences) => {
      if (err != null) {
        return res.send(err);
      } 
      else {
        return res.send(sequences);
      }
    });
});


router.get("/:_id",  function(req, res, next) {
  const query = SequencesModel.findById(req.params._id); 
  query.where({ user_id: req.user_id })
  query.exec((err, sequences) => {
      if (err != null) {
        return res.send(err);
      } 
      else {
        return res.send(sequences);
      }
    });
});


module.exports = router;
