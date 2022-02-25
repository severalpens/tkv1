const ethers = require("ethers");
const cryptoLib = require("crypto");
var moment = require('moment'); // require
const statman = require('statman');
const stopwatch = new statman.Stopwatch();
const dayjs = require('dayjs')
const utils = {};

const bufToStr = (b) => "0x" + b.toString("hex");
const sha256 = (x) => cryptoLib.createHash("sha256").update(x).digest();
const random32 = () => cryptoLib.randomBytes(32);

utils.newSecretHashPair = () => {
  const secret = random32();
  const hash = sha256(secret);
  return {
    secret: bufToStr(secret),
    hash: bufToStr(hash),
  };
};

utils.genAddress = () => {
	let burnAccount = ethers.Wallet.createRandom();
	let ba = burnAccount;
	let burnAddress = ba.address;
	return burnAddress;
}

utils.genAccount = () => {
	let burnAccount = ethers.Wallet.createRandom();
	return burnAccount;
}

 
utils.YYYYMMDDHHmmss = () => {
    return  moment().format('YYYYMMDDHHmmss');
  }


  
module.exports = utils;
