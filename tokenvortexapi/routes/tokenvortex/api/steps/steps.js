var express = require("express");
var router = express.Router();
var cors = require('cors');
router.use(cors());

var deleteRouter = require("./delete");
var insertRouter = require("./insert");
var updateRouter = require("./update");
var lockRouter = require("./lock");

router.use('/lock',lockRouter);
router.use('/delete',deleteRouter);
router.use('/insert',insertRouter);
router.use('/update',updateRouter);

var StepsModel = require('../../models/mongoose/steps');
var SequencesModel = require('../../models/mongoose/sequences');

router.get("/:sequence_id", async function(req, res, next) {
  let user_id = req.user_id;
  let _id = req.params.sequence_id;

  let sequence = await SequencesModel
  .findOne({user_id,_id})
  .exec();

  StepsModel
  .find({})
  .where('_id').in(sequence.step_ids)
  .exec((err, steps) => {
      if (err != null) {
        return res.send(err);
      } 
      else {
        return res.send(steps);
      }
    });
});

module.exports = router;
