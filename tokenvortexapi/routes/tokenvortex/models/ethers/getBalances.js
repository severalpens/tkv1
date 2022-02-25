const EntitiesModel = require("../mongoose/entities");
const Contract = require('./Contract');

async function getBalances(btc){
  let sender = await EntitiesModel.findById(btc.settings.sender_id).lean().exec();
  let recipient = await EntitiesModel.findById(btc.settings.recipient_id).lean().exec();
  let token = await EntitiesModel.findById(btc.settings.token_id).lean().exec();
  let agent = require('./addressBook').agent;
  let senderToken = new Contract(token, btc.settings.senderNetwork, sender);
  let recipientToken = new Contract(token, btc.settings.recipientNetwork,sender);

  let ethBalanceOfSenderOnSenderNetwork = await senderToken.getBalance(sender.body.address);
  let ethBalanceOfRecipientOnSenderNetwork = await senderToken.getBalance(recipient.body.address);
  let tokenBalanceOfAgentOnSenderNetwork  = await senderToken.balanceOf(agent.body.addresses[btc.settings.senderNetwork]);
  let tokenBalanceOfSenderOnSenderNetwork  = await senderToken.balanceOf(sender.body.address);
  let tokenBalanceOfRecipientOnSenderNetwork  = await senderToken.balanceOf(recipient.body.address);

  let ethBalanceOfSenderOnRecipientNetwork = await recipientToken.getBalance(sender.body.address);
  let ethBalanceOfRecipientOnRecipientNetwork = await recipientToken.getBalance(recipient.body.address);
  let tokenBalanceOfAgentOnRecipientNetwork  = await recipientToken.balanceOf(agent.body.addresses[btc.settings.recipientNetwork]);
  let tokenBalanceOfSenderOnRecipientNetwork  = await recipientToken.balanceOf(sender.body.address);
  let tokenBalanceOfRecipientOnRecipientNetwork  = await recipientToken.balanceOf(recipient.body.address);

  let balances = [
    {
      type: 'eth', 
      target: 'sender', 
      senderNetworkBalance: ethBalanceOfSenderOnSenderNetwork,
      recipientNetworkBalance: ethBalanceOfSenderOnRecipientNetwork,
      senderNetworkStatus: ethBalanceOfSenderOnSenderNetwork > 0.05 ? 'sufficient':'insufficient',
      recipientNetworkStatus: ethBalanceOfSenderOnRecipientNetwork > 0.05 ? 'sufficient':'insufficient',
      senderNetworkLink: `https://${btc.settings.senderNetwork}.etherscan.io/address/${sender.body.address}`,
      recipientNetworkLink: `https://${btc.settings.recipientNetwork}.etherscan.io/address/${sender.body.address}`
    },
    {
      type: 'eth', 
      target: 'recipient', 
      senderNetworkBalance: ethBalanceOfRecipientOnSenderNetwork,
      recipientNetworkBalance: ethBalanceOfRecipientOnRecipientNetwork,
      senderNetworkStatus: '',
      recipientNetworkStatus: '',
      senderNetworkLink: `https://${btc.settings.senderNetwork}.etherscan.io/address/${recipient.body.address}`,
      recipientNetworkLink: `https://${btc.settings.recipientNetwork}.etherscan.io/address/${recipient.body.address}`
    },
    {
      type: 'tokens',
      target: 'sender',
      senderNetworkBalance: tokenBalanceOfSenderOnSenderNetwork,
      recipientNetworkBalance: tokenBalanceOfSenderOnRecipientNetwork,
      tokenAmount: btc.settings.tokenAmount,
      senderNetworkStatus: tokenBalanceOfSenderOnSenderNetwork >= btc.settings.tokenAmount ? 'sufficient':'insufficient',
      recipientNetworkStatus: '',
      senderNetworkLink: `https://${btc.settings.senderNetwork}.etherscan.io/token/${senderToken.address}?a=${sender.body.address}`,
      recipientNetworkLink: `https://${btc.settings.recipientNetwork}.etherscan.io/token/${recipientToken.address}?a=${sender.body.address}`,
    },
    {
      type: 'tokens',
      target: 'agent',
      senderNetworkBalance: tokenBalanceOfAgentOnSenderNetwork,
      recipientNetworkBalance: tokenBalanceOfAgentOnRecipientNetwork,
      tokenAmount: btc.settings.tokenAmount,
      senderNetworkStatus: '',
      recipientNetworkStatus: tokenBalanceOfAgentOnRecipientNetwork >= btc.settings.tokenAmount ? 'sufficient':'insufficient',
      senderNetworkLink: `https://${btc.settings.senderNetwork}.etherscan.io/token/${senderToken.address}?a=${agent.body.addresses[btc.settings.senderNetwork]}`,
      recipientNetworkLink: `https://${btc.settings.recipientNetwork}.etherscan.io/token/${recipientToken.address}?a=${agent.body.addresses[btc.settings.recipientNetwork]}`,
    },  
    {
      type: 'tokens',
      target: 'recipient',
      senderNetworkBalance: tokenBalanceOfRecipientOnSenderNetwork,
      recipientNetworkBalance: tokenBalanceOfRecipientOnRecipientNetwork,
      senderNetworkStatus: '',
      recipientNetworkStatus: '',
      senderNetworkLink: `https://${btc.settings.senderNetwork}.etherscan.io/token/${senderToken.address}?a=${recipient.body.address}`,
      recipientNetworkLink: `https://${btc.settings.recipientNetwork}.etherscan.io/token/${recipientToken.address}?a=${recipient.body.address}`,
    },
  ]
  return balances;

}

module.exports = getBalances