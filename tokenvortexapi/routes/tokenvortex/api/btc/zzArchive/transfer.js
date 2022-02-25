const ethers = require("ethers");
const ethersWrapper = require('../../models/ethers/utils/ethersWrapper');
const crypto = require('../../models/ethers/utils/cryptoWrapper');

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
var router = express.Router();

router.use(cors());
router.use(bodyParser.json());
router.use(express.json({ limit: '50mb' }));
router.use(express.urlencoded({ limit: '50mb', extended: false }));
router.use(bodyParser.json({ extended: false }));


const Contract = require('../../../models/ethers/Contract');
const Sequence = require('../../../models/ethers/Sequence');
const BtcModel = require('../../../models/mongoose/btc.js');
const EntitiesModel = require('../../../models/mongoose/entities.js');

let locked = false;
router.post("/refresh", async function (req, res) {
  res.json(locked)
})

  router.post("/run", async function (req, res) {
  if (!locked) {
    locked = true;
    try {
      let btc = req.body[0];
      btc.user_id = req.user_id;
      const settings = btc.settings;

      const sender = await EntitiesModel.findById(settings.sender_id).lean().exec();
      const recipient = await EntitiesModel.findById(settings.recipient_id).lean().exec();
      const token = await EntitiesModel.findById(settings.token_id).lean().exec();
      const agent = require('./utils/btc.json');
      const entities = { sender, recipient, token, agent };

      const burnAccount = ethersWrapper.genAccount();
      const hashPair = crypto.newSecretHashPair();
      const senderToken = new Contract(settings.senderNetwork, sender, token, token.body.abi);
      const senderAgent = new Contract(settings.senderNetwork, sender, agent, btcArtifact.body.abi); //agent/broker/gateway  
      const recipientToken = new Contract(settings.recipientNetwork, sender, token, token.body.abi);
      const recipientAgent = new Contract(settings.recipientNetwork, sender, agent, btcArtifact.body.abi);
      const instances = { burnAccount, hashPair, senderToken, senderAgent, recipientToken, recipientAgent };

      const sequence = new Sequence(entities, settings, instances);

      btc.results = await sequence.runTxs();
      console.log('finished sequence.runTxs()');
      await BtcModel.findByIdAndUpdate(btc._id, btc);
      locked = false
    }
    catch (err) {
      locked = false;
    }
  }else{
    res.send('locked')
  }

});



module.exports = router;
