const statman = require('statman');
const addressBook = require('./addressBook');
const Contract = require('./Contract');
const utils = require('./utils');

class Sequence {
  constructor(settings, sender, recipient, token,agent) {
    this.settings = settings;
    this.burnAccount = utils.genAccount();
    this.hashPair = utils.newSecretHashPair();
    this.sender = sender;
    this.recipient = recipient;
    this.token = token;
    this.agent = agent;

    this.periodStart = new Date().getTime();
    this.periodStartSeconds = Math.floor(this.periodStart / 1000);
    this.periodEndSeconds = this.periodStartSeconds + settings.timeoutSeconds;

    this.senderToken = new Contract(this.token, settings.senderNetwork, this.sender);
    this.senderAgent = new Contract(addressBook.agent, settings.senderNetwork, this.sender);
    this.recipientToken = new Contract(this.token, settings.recipientNetwork, this.sender);
    this.recipientAgent = new Contract(addressBook.agent, settings.recipientNetwork, this.sender);
    this.transactionId = '';
    this.expired = false;
   // this.seedTxs('');
  }


  // async runTxsOld(btc) {
  //   this.timeoutTimer = new statman.Stopwatch();
  //   for (const tx of this.txs) {
  //     if (tx.method == 'add') {
  //       let stophere = true;
  //     }
  //     let instance = this[tx.instance];
  //     if (this.checkTimeout(tx)) {
  //       let result = await instance.run(tx);
  //       try {
  //         if (tx.method === 'exitTransaction') {
  //           let transactionId = result.events[result.events.length - 1].args.transactionId;
  //           console.log(`transactionId: ${this.transactionId}`);
  //           this.seedTxs(transactionId);
  //         }
  //       }
  //       catch (err) {
  //         result = err;
  //       }
  //       finally {
  //         btc.results.push(result);
  //         await await btc.save();
  //       }
  //     }
  //   }
  // }


  checkTimeout(tx) {
    if (!this.timeoutTimer) {
      return true;
    }
    let timeSplit = Math.floor(this.timeoutTimer.read(0) / 1000)
    let expired = timeSplit >= 20000;
    if (tx.preTimeout && !expired) {
      return true;
    }
    if (!tx.preTimeout && expired) {
      return true;
    }
    return false;
  }


  async runTxs(btc) {
    btc.results = [];
    await btc.save();
    this.timeoutTimer = new statman.Stopwatch();
    let transactionId = '';

    let approve = await this.senderToken.run('approve', [
      this.senderAgent.address,
      this.settings.tokenAmount
    ]);

    btc.results.push({
      text: 'approve',
      value: approve.transactionHash,
      link: `https://${this.settings.senderNetwork}.etherscan.io/tx/${approve.transactionHash}` 
    });
    
    await btc.save();

    let exitTransaction = await this.senderAgent.run('exitTransaction', [
      this.burnAccount.address,
      this.hashPair.hash,
      this.periodEndSeconds,
      this.senderToken.address,
      this.settings.tokenAmount
    ])
    btc.results.push({
      text: 'exitTransaction',
      value: exitTransaction.transactionHash,
      link: `https://${this.settings.senderNetwork}.etherscan.io/tx/${exitTransaction.transactionHash}` 
       });
    await btc.save();

    transactionId = exitTransaction.events[exitTransaction.events.length - 1].args.transactionId;
    btc.results.push({
      text: 'transactionId',
      value: transactionId,
      link: `https://${this.settings.senderNetwork}.etherscan.io/tx/${transactionId}` 
       });
    await btc.save();

    let add = await this.recipientAgent.run('add', [
      this.senderAgent.address,
      transactionId,
      this.burnAccount.address,
      this.hashPair.hash,
      this.periodEndSeconds,
      this.recipientToken.address,
      this.settings.tokenAmount
    ])
    btc.results.push({
      text: 'add',
      value: add.transactionHash,
      link: `https://${this.settings.recipientNetwork}.etherscan.io/tx/${add.transactionHash}` 
       });
    await btc.save();


    let entryTransaction = await this.recipientAgent.run('entryTransaction', [
      this.settings.tokenAmount,
      this.recipient.body.address,
      transactionId,
      this.hashPair.secret
    ])
    btc.results.push({
      text: 'entryTransaction',
      value: entryTransaction.transactionHash,
      link: `https://${this.settings.recipientNetwork}.etherscan.io/tx/${entryTransaction.transactionHash}` 
       });
    await btc.save();

    let update = await this.senderAgent.run('update', [
      this.recipientAgent.address,
      transactionId,
      this.hashPair.secret,
    ])
    btc.results.push({
      text: 'update',
      value: update.transactionHash,
      link: `https://${this.settings.senderNetwork}.etherscan.io/tx/${update.transactionHash}` 
       });
    await btc.save();



  }


  // seedTxs() {
  //   let settings = this.settings;

  //   this.txs = [
  //     {
  //       preTimeout: true,
  //       instance: 'senderToken',
  //       method: 'approve',
  //       args: [
  //         this.senderAgent.address,
  //         settings.tokenAmount
  //       ],
  //     },
  //     {
  //       preTimeout: true,
  //       instance: 'senderAgent',
  //       method: 'exitTransaction',
  //       args: [
  //         this.burnAccount.address,
  //         this.hashPair.hash,
  //         this.periodEndSeconds,
  //         this.senderToken.address,
  //         settings.tokenAmount

  //       ],
  //     },
  //     {
  //       preTimeout: false,
  //       instance: 'senderAgent',
  //       method: 'reclaimTransaction',
  //       args: [
  //         transactionId
  //       ],
  //     },
  //     {
  //       preTimeout: true,
  //       instance: 'recipientAgent',
  //       method: 'add',
  //       args: [
  //         this.senderAgent.address,
  //         transactionId,
  //         this.burnAccount.address,
  //         this.hashPair.hash,
  //         this.periodEndSeconds,
  //         this.recipientToken.address,
  //         settings.tokenAmount

  //       ],
  //     },
  //     {
  //       preTimeout: true,
  //       instance: 'recipientAgent',
  //       method: 'entryTransaction',
  //       args: [
  //         settings.tokenAmount,
  //         this.recipient.address,
  //         transactionId,
  //         this.hashPair.secret

  //       ],
  //     },
  //     {
  //       preTimeout: true,
  //       instance: 'senderAgent',
  //       method: 'update',
  //       args: [
  //         this.recipientAgent.address,
  //         transactionId,
  //         this.hashPair.secret,
  //       ],
  //     },
  //   ]
  // }

}

module.exports = Sequence;