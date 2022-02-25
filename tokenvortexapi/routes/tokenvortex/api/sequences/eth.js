var ethers = require("ethers");
var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");

var router = express.Router();

router.use(cors());
router.use(bodyParser.json());
router.use(express.json({limit: '50mb'}));
router.use(express.urlencoded({limit: '50mb',extended: false}));
router.use(bodyParser.json({extended: false}));


router.post("/balance", async function (req, res) {
  let address = req.body;
  address.user_id = req.user_id;
  let provider = new ethers.providers.InfuraProvider(address.network, 'abf62c2c62304ddeb3ccb2d6fb7a8b96');
  let balance = await provider.getBalance(address.address);
  res.send(balance);
});



router.post("/transfer", async function (req, res) {
  let transfer = req.body;
  let provider = new ethers.providers.InfuraProvider(transfer.network, 'abf62c2c62304ddeb3ccb2d6fb7a8b96');
  let wallet = new ethers.Wallet(transfer.sender.body.privateKey, provider);
  let amount = ethers.utils.parseUnits(transfer.amount.toString(),transfer.denomination.unit);
  
  let tx = {
      to: transfer.recipient.body.address,
      value: amount
  };
  
  let sendPromise = wallet.sendTransaction(tx);
  
  sendPromise.then((tx) => {
      console.log(tx);
      res.send(tx);
  });
});



module.exports = router;
