const ethers = require("ethers");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const BtcModel = require("../../../models/mongoose/btc");
const EntitiesModel = require("../../../models/mongoose/entities");
const Contract = require('../../../models/ethers/Contract');

var router = express.Router();
router.use(cors());
router.use(express.json({ limit: '50mb' }));
router.use(express.urlencoded({ limit: '50mb', extended: false }));
router.use(bodyParser.json({ extended: false }));

router.get("/", async function (req, res, next) {
  let user_id = req.user_id;
  let btc = await BtcModel.findOne({ user_id }).lean().exec();
  res.send(btc);
});

router.post("/update", bodyParser.json(), async function (req, res, next) {
  user_id = req.user_id;
  let btc = req.body;
  btc.user_id = user_id;
  
  BtcModel.findOneAndUpdate({user_id}, btc)
    .exec((err, result) => {
      if (err) {
        res.send(err)
      }
      res.send(result)
    });
});



router.post("/checkbalances/:_id", async function (req, res) {
  let settings = req.body.settings;

  let sender = await EntitiesModel.findById(settings.sender_id).lean().exec();
  let recipient = await EntitiesModel.findById(settings.recipient_id).lean().exec();
  let token = await EntitiesModel.findById(settings.token_id).lean().exec();
  let agent = require('../../../models/ethers/addressBook').agent;
  
  
  let senderToken = new Contract(token, settings.senderNetwork, sender);
  let senderAgent = new Contract(agent, settings.senderNetwork, sender);  
  let recipientToken = new Contract(token, settings.recipientNetwork,sender);
  let recipientAgent = new Contract(agent, settings.recipientNetwork, sender);

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

  res.json(balances);

});

async function getEthBalance(network, msgSender) {
  let provider = new ethers.providers.InfuraProvider(network, process.env.INFURA);
  let balanceInWei = await provider.getBalance(msgSender.body.address);
  let wei = parseInt(balanceInWei._hex);
  let eth = wei * 0.000000000000000001;
  return eth;
}

async function getBalanceOf(token_id, network, msgSender) {
  let token = await EntitiesModel.findById(token_id).lean().exec();
  let tokenAddress = token.body.addresses[network];
  let provider = new ethers.providers.InfuraProvider(network, process.env.INFURA);
  let privateKey = msgSender.body.privateKey;
  let msgSender_id = msgSender._id.toString();
  // if (msgSender_id === process.env.admin_id) {
  //   privateKey = process.env.privateKey;
  // }
  let wallet = new ethers.Wallet(privateKey, provider);
  let ethersContract = new ethers.Contract(tokenAddress, token.body.abi, wallet);
  let balanceInWei = await ethersContract.balanceOf(msgSender.body.address);
  let wei = parseInt(balanceInWei._hex);
  let eth = wei * 0.000000000000000001;
  let balance = eth * (10 ** (18 - token.body.decimals));
  return balance;
}


module.exports = router;
