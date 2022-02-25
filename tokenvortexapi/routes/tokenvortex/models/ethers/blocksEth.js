require('dotenv').config()
const ethers = require('ethers');
const fs = require('fs-extra');
const { Parser } = require('json2csv');

let provider = new ethers.providers.InfuraProvider("homestead", process.env.INFURA);
const blocks = [];

provider.on("block", async (blockNumber) => {
  console.log(blockNumber)
  let block = await provider.getBlock(blockNumber);
  blocks.push(block);
  delete block.transactions;
  console.log(block);
});


function writeToFile(blocks){
  fs.writeJsonSync('./blocks.json', blocks);
  const fields = ['hash', 'parentHash', 'number', 'timestamp', 'nonce', 'difficulty', 'miner', 'extraData'];
  const opts = { fields };
   const parser = new Parser(opts);
  const csv = parser.parse(blocks);
  fs.writeFileSync('blocks.csv',csv,'utf8');
}









