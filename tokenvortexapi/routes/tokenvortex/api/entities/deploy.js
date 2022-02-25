var express = require("express");
var router = express.Router();
var cors = require('cors');
const ethers = require('ethers')

router.use(cors());
var bodyParser = require("body-parser");
var EntitiesModel = require('../../models/mongoose/entities');
const admin_id = process.env.admin_id;

router.post("/:contract_id", bodyParser.json(), async function (req, res, next) {
  let deploy = req.body;
  let contract = await EntitiesModel.findById(req.params.contract_id).lean().exec();
  let bytecode = JSON.parse(contract.body.bytecode);
  let provider = new ethers.providers.InfuraProvider(deploy.network, process.env.INFURA);
  let privateKey = deploy.msgSender.body.privateKey;
  // if(deploy.msgSender._id === process.env.admin_id){
  //   privateKey = process.env.privateKey;
  // }
  let wallet = new ethers.Wallet(privateKey, provider);
  let factory = new ethers.ContractFactory(contract.body.abi, bytecode.object, wallet);
  let args = deploy.inputs.map(x => x.value);
  let tx = await factory.deploy(...args);
  tx.deployed();
  res.json(tx);


});


module.exports = router;
