const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');
const router = express.Router();

router.use(cors());
router.use(bodyParser.json());
router.use(express.json({ limit: '50mb' }));
router.use(express.urlencoded({ limit: '50mb', extended: false }));
router.use(bodyParser.json({ extended: false }));


const BtcModel = require("../../models/mongoose/btc");
const EntitiesModel = require("../../models/mongoose/entities");
const btcAddresses = require("../../models/ethers/builds/btcAddresses.json");
const Sequence = require('../../models/ethers/Sequence');
const Contract = require('../../models/ethers/Contract');
const getBalances = require('../../models/ethers/getBalances');

router.get("/", async function(req, res, next) {
  let user_id = req.user_id;
  let result = await BtcModel.findOne({user_id}).exec();
  res.send(result);
});


router.get("/balances", async function(req, res, next) {
  console.log('getting balances');
  let user_id = req.user_id
  let btc = await BtcModel.findOne({user_id}).lean().exec();
  btc.balances = await getBalances(btc);
  await BtcModel.updateOne({user_id},btc).exec();
  res.send(btc);
});



router.post("/insert", bodyParser.json(), async function (req, res, next) {
  console.log('insert');
  let btc = req.body;
  btc.user_id = req.user_id;
 // btc.balances = await getBalances(btc);
  BtcModel.create(btc).then(result => {
    res.send(result);
  });
});

router.post("/update", async function(req, res, next) {
  console.log('update');
  let user_id = req.user_id;
  let btc = req.body;
  btc.user_id = user_id;
  btc.balances = await getBalances(btc);
  let result = await BtcModel.findOneAndUpdate({user_id},btc).setOptions({useFindAndModify:false}).exec();
  res.send(result);
});


router.get("/addresses", async function(req, res, next) {
  let addresses = [
    {network: 'ropsten',address: btcAddresses.ropsten},
   {network: 'kovan',address: btcAddresses.kovan},
   {network: 'rinkeby',address: btcAddresses.rinkeby},
  {network: 'goerli',address: btcAddresses.goerli}
]
  res.send(addresses)
});


router.post("/initialize", async function (req, res) {
  let transfer = req.body;
  let user_id = req.user_id;
  let token = await EntitiesModel.findById(transfer.token_id).lean().exec();
  let contract = new Contract(token,transfer.network,transfer.msgSender);
  let btc = await BtcModel.findOne({user_id}).exec();
  let signedTx = await contract.ethersContract.transfer(transfer.agentAddress,transfer.amount,contract.overrides);
  res.json({transactionHash: signedTx.hash});
  await signedTx.wait().then(async (completedTx) => {
    console.log('completedTx');
    btc.balances = await getBalances(btc);
    btc.save();
  })
  .catch(async (completedTxError) => {
    console.log('completedTxError');
  })

});

router.post("/transfer", async function(req, res, next) {
  let user_id = req.user_id;
  let btc = await BtcModel.findOne({user_id}).exec();
  let sender = await EntitiesModel.findById(btc.settings.sender_id).lean().exec();
  let recipient = await EntitiesModel.findById(btc.settings.recipient_id).lean().exec();
  let token = await EntitiesModel.findById(btc.settings.token_id).lean().exec();
  let agent = await EntitiesModel.findById(btc.settings.agent_id).lean().exec();
  let sequence = new Sequence(btc.settings, sender,recipient,token,agent);
  let status  = 'sequence started';
  res.json(status);
  await sequence.runTxs(btc);
  //btc.save();
});


let locked = false;
router.post("/reset", async function (req, res) {
  res.json(locked)
})



module.exports = router;
