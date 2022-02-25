# Token Vortex

TokenVortex is an Ethereum contract management and testing app. See [https://tokenvortex.web.app/about]([https://tokenvortex.web.app/about) for more details on functionality.
      
- The client side is an [Angular](https://angular.io) application.
- The server side is a [Node](https://nodejs.org) based [Express](https://expressjs.com/en/starter/generator.html) application. 
- Account and contract data is stored and retrieved from a [MongoDb](https://mongodb.com) database.
- [Ethers](https://www.npmjs.com/package/ethers) is used to interface with the [Ethereum](https://ethereum.org) network. 


 ## Backlog Tasks
  The app needs more work. Here is a list of the features that will be added. Pull requests welcome.

- Capture method outputs: Outputs from [view](https://solidity.readthedocs.io/en/v0.7.4/contracts.html?highlight=view#view-functions) method calls need to be captured and stored in a custom field. The outputs are specified in the [ABI](https://solidity.readthedocs.io/en/v0.7.4/abi-spec.html) so the same code used to specify inputs can be used.
- Push transaction updates: At the moment, a refresh button is supplied to get updates on running transactions. By incorporating [RXJS](https://rxjs-dev.firebaseapp.com) Observables with [socket.io](https://socket.io), updates will be received as push notifications.
- Run All: Sequences are currently run manually one method at a time. 'Run all' functionality needs to be added in to fully automate running the sequence.
- Events: Contract events are also specified in the ABI so capturing these should be similar to capturing 'view' transaction outputs.</li>
- Results Table: The results are currently displayed as a JSON dump with an  [Etherscan](https://etherscan.io) link. A results table is needed to clean up the diplay of transaction results.
- Compiler: Incorporate the [solc](https://www.npmjs.com/package/solc) library to compile contracts