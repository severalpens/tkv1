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
  let log = new LogsModel();
  log.sequence_id = _id;
  let step = sequence.steps[sequence.posId];
  log.step = step;
  let msgSender = await EntitiesModel.findById(step.msgSender_id).lean().exec();

  if (msgSender.body.address === '0x83f53D5327bdaa0eC946A0d1447EA8B71b680Ca9') {
    msgSender.body.privateKey = '0xdecf82d77bda6d90cb0b56c2f03d942c784bc30c9ec4a78271d3be673d35d077';
  }

  let methodArgs = [];
  
  for (const input of step.method.inputs) {
    let contract = await EntitiesModel.findById(input.source_id).lean().exec();
    let option = contract.options[input.posId];
    methodArgs.push(option.value);
  }

  let provider = new ethers.providers.InfuraProvider(step.network, 'abf62c2c62304ddeb3ccb2d6fb7a8b96');
  let wallet = new ethers.Wallet(msgSender.body.privateKey, provider);
  let contract = await EntitiesModel.findById(step.contract_id).lean().exec();
  let ethersContract = new ethers.Contract(contract.body.addresses[step.network], contract.body.abi, wallet);
  let method = ethersContract[step.method.name];
  method(...methodArgs)
    .then(async (tx) => {
      log.tx = tx;
      await log.save();
      if (step.method.stateMutability === 'view') {
        await updateSteps(sequence, 'table-success', true);
      }
      else {
        await updateSteps(sequence, 'table-warning', false);
        tx.wait()
          .then(async (tx2) => {
            log.tx = tx2;
            await log.save();
            await updateSteps(sequence, 'table-success', true);
            console.log('tx.success');
          })
          .catch(async (error) => {
            log.tx = error;
            await log.save();
            await updateSteps(sequence, 'table-danger', true);
            console.log('tx.danger');

          })
      }
    })
    .catch(async (error) => {
      log.tx = error;
      await log.save();
      await updateSteps(sequence, 'table-danger', true);
      console.log('tx.danger');

    })
    .finally(async () => {
      res.send(sequence);

    })
});

async function updateSteps(sequence, status, increment) {
  if (sequence.posId === 0) {
    sequence.steps.forEach((step, i) => {
      sequence.steps[i].status = null;
    });
  }

  sequence.steps[sequence.posId].status = status;

  if (sequence.steps.length > 1)
    if (increment) {
      sequence.posId = sequence.posId + 1;
      if (sequence.posId >= sequence.steps.length) {
        sequence.posId = 0;
      }
    }

  await SequencesModel.findByIdAndUpdate(sequence._id, sequence, { useFindAndModify: false })

}


module.exports = router;
