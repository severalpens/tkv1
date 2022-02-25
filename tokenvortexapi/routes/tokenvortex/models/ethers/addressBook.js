module.exports =  {
  admin: {
    name: "Admin",
    entityType: 'account',
    body: {
      type: "account",
      address: "0x83f53D5327bdaa0eC946A0d1447EA8B71b680Ca9",
      privateKey: "0xdecf82d77bda6d90cb0b56c2f03d942c784bc30c9ec4a78271d3be673d35d077"
    }
  },
  sender: {
    name: "Alice",
    type: "account",
    body: {
      address: "0x83f53D5327bdaa0eC946A0d1447EA8B71b680Ca9",
      privateKey: "0xdecf82d77bda6d90cb0b56c2f03d942c784bc30c9ec4a78271d3be673d35d077"
    }
  },
  recipient: {
    name: "Bob",
    entityType: "account",
    body: {
      address: "0xd627a8B6dbEA4C24a2a4D34E367C27E8019533BA",
      privateKey: "ab4c632b201914ffbd8a53560aebb9206009bb7d1a73930f43bf96caf24d9e10"
    }
  },
  agent: {
    name: "BurnToClaim",
    entityType: 'contract',
    body: {
      symbol: "BTC",
      version: "3",
      role: "agent",
      type: "contract",
      addresses: require('./builds/btcAddresses.json'),
      abi: require('./builds/BurnToClaim.json').abi

    }
  }
}