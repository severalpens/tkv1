const express = require("express");
const bodyParser = require("body-parser");
const EntitiesModel = require("../../../models/mongoose/entities");
const Contract = require('../../../models/ethers/Contract');
var router = express.Router();

router.post("/run", async function (req, res) {
  let transfer = req.body;
  let token = await EntitiesModel.findById(transfer.token_id).lean().exec();
  let contract = new Contract(token,transfer.network,transfer.msgSender);
  let tx = {method: 'transfer',args:[transfer.agentAddress, transfer.amount]}
  let result = await contract.run(tx);
  return(result);
});

router.post("/balance", async function (req, res) {
  let transfer = req.body;
  let token = await EntitiesModel.findById(transfer.token_id).lean().exec();
  let contract = new Contract(token,transfer.network,transfer.msgSender);
  let result = await contract.balanceOf(transfer.msgSender.body.address);
  return(result);
});


module.exports = router;
