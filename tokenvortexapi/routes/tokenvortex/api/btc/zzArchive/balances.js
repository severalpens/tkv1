const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const EntitiesModel = require("../../../models/mongoose/entities");
const Contract = require('../../../models/ethers/Contract');
const BtcModel = require("../../../models/mongoose/btc");

var router = express.Router();
router.use(cors());
router.use(express.json({ limit: '50mb' }));
router.use(express.urlencoded({ limit: '50mb', extended: false }));
router.use(bodyParser.json({ extended: false }));

router.post("/", async function (req, res) {
  let settings = req.body.settings;
  let btc = await BtcModel.findOne({user_id: req.user_id}).exec();
  let sender = await EntitiesModel.findById(settings.sender_id).lean().exec();
  let recipient = await EntitiesModel.findById(settings.recipient_id).lean().exec();
  let token = await EntitiesModel.findById(settings.token_id).lean().exec();
  let agent = require('../../../models/ethers/addressBook').agent;
  let senderToken = new Contract(token, settings.senderNetwork, sender);
  let recipientToken = new Contract(token, settings.recipientNetwork,sender);

  let ethBalanceOfSenderOnSenderNetwork = await senderToken.getBalance(sender.body.address);
  let ethBalanceOfRecipientOnSenderNetwork = await senderToken.getBalance(recipient.body.address);
  let tokenBalanceOfAgentOnSenderNetwork  = await senderToken.balanceOf(agent.body.addresses[settings.senderNetwork]);
  let tokenBalanceOfSenderOnSenderNetwork  = await senderToken.balanceOf(sender.body.address);
  let tokenBalanceOfRecipientOnSenderNetwork  = await senderToken.balanceOf(sender.body.address);

  let ethBalanceOfSenderOnRecipientNetwork = await recipientToken.getBalance(sender.body.address);
  let ethBalanceOfRecipientOnRecipientNetwork = await recipientToken.getBalance(recipient.body.address);
  let tokenBalanceOfAgentOnRecipientNetwork  = await recipientToken.balanceOf(agent.body.addresses[settings.recipientNetwork]);
  let tokenBalanceOfSenderOnRecipientNetwork  = await recipientToken.balanceOf(sender.body.address);
  let tokenBalanceOfRecipientOnRecipientNetwork  = await senderToken.balanceOf(recipient.body.address);

  let balances = [
    {
      type: 'eth', 
      target: 'sender', 
      senderNetworkBalance: ethBalanceOfSenderOnSenderNetwork,
      recipientNetworkBalance: ethBalanceOfSenderOnRecipientNetwork,
    },
    {
      type: 'eth', 
      target: 'recipient', 
      senderNetworkBalance: ethBalanceOfRecipientOnSenderNetwork,
      recipientNetworkBalance: ethBalanceOfRecipientOnRecipientNetwork,
    },
    {
      type: 'tokens',
      target: 'agent',
      senderNetworkBalance: tokenBalanceOfAgentOnSenderNetwork,
      recipientNetworkBalance: tokenBalanceOfAgentOnRecipientNetwork,
    },  
    {
      type: 'tokens',
      target: 'sender',
      senderNetworkBalance: tokenBalanceOfSenderOnSenderNetwork,
      recipientNetworkBalance: tokenBalanceOfSenderOnRecipientNetwork,
    },
    {
      type: 'tokens',
      target: 'recipient',
      senderNetworkBalance: tokenBalanceOfRecipientOnSenderNetwork,
      recipientNetworkBalance: tokenBalanceOfRecipientOnRecipientNetwork,
    },
  ]
  btc.balances = balances;
  await btc.save();
  res.json(btc);

});



module.exports = router;
