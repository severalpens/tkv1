var express = require("express");
var router = express.Router();
var cors = require('cors');
router.use(cors());
const crypto = require('crypto');
const ethers = require('ethers');


var functions = {};

function customise(entity) {
  if (entity.entityType === 'hashPair') {
    entity.body = newSecretHashPair();
  }
  if (entity.entityType === 'randomAccount') {
    entity.body = newRandomAccount();
  }
  if (entity.entityType === 'account') {
    entity = addAccountOptions(entity);
  }  
  if (entity.entityType === 'contract') {
    entity = addContractOptions(entity);
  }
  return entity;
}

function  addAccountOptions(entity){
  let item = {text:'Address',value:entity.body.address}
  let options = [];
  options.push(item);
  entity.options = options;
  return entity;
}


function  addContractOptions(entity){
  let ropstenAddress = {text:'Ropsten Address',value:entity.body.addresses.ropsten};
  let kovanAddress = {text:'Kovan Address',value:entity.body.addresses.kovan};
  let rinkebyAddress = {text:'Rinkeby Address',value:entity.body.addresses.rinkeby};
  let goerliAddress = {text:'Goerli Address',value:entity.body.addresses.goerli};

  let options = [];
  options.push(ropstenAddress);
  options.push(kovanAddress);
  options.push(rinkebyAddress);
  options.push(goerliAddress);

  entity.options = options;
  return entity;
}

function newRandomAccount() {
  let randomAccount = ethers.Wallet.createRandom();
  let body = {};
  body.address = randomAccount.address;
  body.privateKey = randomAccount.privateKey;
  return body;
}

const bufToStr = b => '0x' + b.toString('hex');

const sha256 = x =>
  crypto
    .createHash('sha256')
    .update(x)
    .digest()

const random32 = () => crypto.randomBytes(32)

const isSha256Hash = hashStr => /^0x[0-9a-f]{64}$/i.test(hashStr)

const newSecretHashPair = () => {
  const secret = random32()
  const hash = sha256(secret)
  return {
    secret: bufToStr(secret),
    hash: bufToStr(hash),
  }
}

const validateAccount = async (account) => {
  let result = false;
  let provider = new ethers.providers.InfuraProvider('rinkeby', process.env.INFURA);
  let wallet = new ethers.Wallet(account.body.privateKey, provider); 
   let extractedAddress = await wallet.getAddress();
 if(extractedAddress === account.body.address){
  result = true;
 }
 return result;
}


functions.validateAccount = validateAccount;
functions.customise = customise;
functions.newRandomAccount = newRandomAccount;
functions.newSecretHashPair = newSecretHashPair;
module.exports = functions;