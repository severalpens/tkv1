const ethers = require("ethers");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const EntitiesModel = require("../../models/mongoose/entities");

var router = express.Router();

router.use(cors());
router.use(bodyParser.json());
router.use(express.json({ limit: '50mb' }));
router.use(express.urlencoded({ limit: '50mb', extended: false }));
router.use(bodyParser.json({ extended: false }));


router.post("/balance", async function (req, res) {
  let transfer = req.body;
  let contract = await EntitiesModel.findById(transfer.contract_id).lean().exec();
  let contractAddress = contract.body.addresses[transfer.network];
  let provider = new ethers.providers.InfuraProvider(transfer.network, 'abf62c2c62304ddeb3ccb2d6fb7a8b96');
  let privateKey = transfer.msgSender.body.privateKey;
  if(transfer.msgSender._id === '5f8f88e5d28b37394459bbba'){
    privateKey = '0xdecf82d77bda6d90cb0b56c2f03d942c784bc30c9ec4a78271d3be673d35d077';
  }
  let wallet = new ethers.Wallet(privateKey, provider);
  let ethersContract = new ethers.Contract(contractAddress, contract.body.abi, wallet);
  let balanceInWei = await ethersContract.balanceOf(transfer.recipient.address);
  let wei = parseInt(balanceInWei._hex);
  let eth = wei * 0.000000000000000001;
  let balance = eth *  (10**(18-contract.body.decimals));
  res.json(balance);
});

router.post("/transfer", async function (req, res) {
  let transfer = req.body;
  let contract = await EntitiesModel.findById(transfer.contract_id).lean().exec();
  let contractAddress = contract.body.addresses[transfer.network];
  let provider = new ethers.providers.InfuraProvider(transfer.network, 'abf62c2c62304ddeb3ccb2d6fb7a8b96');
  let privateKey = transfer.msgSender.body.privateKey;
  if(transfer.msgSender._id === '5f8f88e5d28b37394459bbba'){
    privateKey = '0xdecf82d77bda6d90cb0b56c2f03d942c784bc30c9ec4a78271d3be673d35d077';
  }
  let wallet = new ethers.Wallet(privateKey, provider);
  let ethersContract = new ethers.Contract(contractAddress, contract.body.abi, wallet);
  ethersContract.transfer(transfer.recipient.address,transfer.amount)
    .then(async (tx) => {
        tx.wait()
          .then(async (tx2) => {
            res.send({tx2});
          })
          .catch(async (error) => {
            res.send({error,transfer,contract,contractAddress});
          })
    })
    .catch(async (error) => {
      res.send({error,transfer,contract,contractAddress});
    })
});



module.exports = router;
