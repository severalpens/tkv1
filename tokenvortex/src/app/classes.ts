import { Contract } from 'src/app/contracts/contract';
import { Account } from 'src/app/accounts/account';


export class Item {
  entity_id?: string;
  text: string;
  value: any;
}

export interface IEntity{
  buildOptions: any;
  _id?: string;
  user_id?: string;
  entityType: string;
  name: string;
  body: any;
  options: Array<Item>;
  lifespan: string;
}

// export abstract class Entity implements IEntity{
//     _id?: string;
//     user_id?: string;
//     entityType: string;
//     name: string;
//     body: any;
//     options: Array<Item>;
//     lifespan: string;
//     constructor(){
//       this.options = new Array<Item>();
//     }
//     buildOptions(){
//     }
// }

export class Generic implements IEntity{
  _id?: string;
  user_id?: string;
  entityType: string;
  name: string;
  options: Array<Item>;
  body = {value: ''};
  lifespan = 'static';
  
  constructor(){
    this.entityType = 'generic';
    this.options = new Array<Item>();
  }

  buildOptions(){
    this.options = new Array<Item>();
    let opt1 = new Item();
    opt1.text = 'value';
    opt1.value = this.body.value;
    this.options.push(opt1);
  }

}



export class RandomAccount implements IEntity{
  _id?: string;
  user_id?: string;
  entityType: string;
  name: string;
  options: Array<Item>;
  body: {
    address: string,
    privateKey: string
  }
  lifespan = 'static';
  constructor(){
    this.entityType = 'randomAccount';
    this.body = {

      address: '',
      privateKey: ''
    }
  }
  
  buildOptions(){
    this.options = new Array<Item>();
    let opt1 = new Item();
    opt1.text = 'address';
    opt1.value = this.body.address;
    this.options.push(opt1);

    let opt2 = new Item();
    opt2.text = 'privateKey';
    opt2.value = this.body.privateKey;
    this.options.push(opt2); 

  }
}


export class HashPair implements IEntity{
  _id?: string;
  user_id?: string;
  entityType: string;
  name: string;
  options: Array<Item>;
  body: {
    hash: string,
    secret: string
  }
  lifespan = 'static';
  constructor(){
    this.entityType = 'hashPair';
    this.body = {
      hash: '',
      secret: ''
    }
  }
  
  buildOptions(){
    this.options = new Array<Item>();
    let opt1 = new Item();
    opt1.text = 'hash';
    opt1.value = this.body.hash;
    this.options.push(opt1);

    let opt2 = new Item();
    opt2.text = 'secret';
    opt2.value = this.body.secret;
    this.options.push(opt2); 

  }
}

export class Step {
  _id?: string;
  entityType: string;
  user_id: string;
  status: string;
  network: string;
  msgSender_id: string;
  contract_id: string;
  method: Method;
  orderId: number;
  amount: number;
  creationUtc: number;
}


export class Input {
  source_id?: string;
  value?: string;
  posId?: number;
  internalType?: string;
  type: string;
  name: string;
  text?: string;
}

export class Output {
  internalType: string;
  type: string;
  text: string;
}



export class Method {
  constructor(){
    this.inputs = new Array<Input>();
    this.outputs = new Array<Output>();
  }
  
  inputs: Array<Input>;
  name: string;
  outputs: Array<Output>;
  payable: false;
  stateMutability: string;
  type: string;
}







export class Sequence {
  _id?: string;
  entityType = 'sequence';
  user_id: string;
  name: string;
  posId: number;
  desc: string;
  steps: Array<Step>;
  logs: Array<Log>;
  creationUtc: number;
  status: string;
  constructor(user_id: string){
    this.user_id = user_id;
    this.steps = new Array<Step>();
    this.logs = new Array<Log>();
    this.creationUtc = new Date().getTime();
  }  
}



export class SelectionIds{
  network: string;
  msgSender: string;
  contract: string;
  method: any;
}

export const selectOptions = {
  networks: ['ropsten', 'kovan', 'rinkeby', 'goerli'],
  types: ['bytes32', 'uint256', 'address', 'bool'],
  primitives: ['string', 'number', 'address', 'bool'],
  boolean: ["true", "false"],
  bool: [
    { text: 'Yes', value: true },
    { text: 'No', value: false },
  ],
  inputs: [],
  outputs: [],
  contractFields: [
  { text: 'Name', value: 'name' },
  { text: 'Symbol', value: 'symbol' },
  { text: 'Version', value: 'version' },
  { text: 'Description', value: 'description' },
  { text: 'User_id', value: 'user_id' },
  { text: 'Ropsten Address', value: 'ropsten' },
  { text: 'Kovan Address', value: 'kovan' },
  { text: 'Rinkeby Address', value: 'rinkeby' },
  { text: 'Goerli Address', value: 'goerli' },
  ],
  lifespans: [
    { text: 'Static (unchanging)', value: 'static' },
    { text: 'Per sequence', value: 'sequence' },
    { text: 'Per method call (step)', value: 'method' }
  ],
  entityTypes: [
    { text: 'Generic (string/boolean/number)', value: 'generic' },
    { text: 'Contract', value: 'contract' },
    { text: 'Hash pair', value: 'hashPair' },
    { text: 'Random account', value: 'randomAccount' },
    { text: 'Timer (Seconds)', value: 'timer' },
  ],
  customFieldTypes: [
    { text: 'Generic (string/boolean/number)', value: 'generic' },
    { text: 'Hash pair', value: 'hashPair' },
    { text: 'Random account', value: 'randomAccount' },
  ]
  ,denominations: [
    { unit: 'wei',alt:'',                 wei: 1, ether: 0.000000000000000001 },
    { unit: 'kwei',alt:'babbage',         wei: 1000, ether: 0.000000000000001 },
    { unit: 'mwei',alt:'lovelace',        wei: 1000000, ether: 0.000000000001 },
    { unit: 'gwei',alt:'shannon',         wei: 1000000000, ether: 0.000000001 },
    { unit: 'szabo',alt:'microether',     wei: 1000000000000, ether: 0.000001 },
    { unit: 'finney',alt:'milliether',    wei: 1000000000000000, ether: 0.001 },
    { unit: 'ether',alt:'',               wei: 1000000000000000000, ether: 1 },
  ]
  ,contractTypes:['ERC20','ERC721','Other']
}

export class ExtractedAddress {
  constructor(name,type,network,address){
    this.name = name;
    this.type = type;
    this.network = network;
    this.address = address;
  }
  name: string;
  type: string;
  network: string;
  address: string;
  balance: number;
}

export class Transfer{
  network: string;
  sender: Account;
  recipient: Account;
  amount: number;
  denomination: string;
}

export class TokenTransfer{
  contract_id: string;
  network: string;
  msgSender: Account;
  recipient: ExtractedAddress;
  amount: number;
}



export class Address{
  network: string;
  address: string;
}

export class BalanceQuery {
  constructor(){
  }
  _id: string;
  name: string;
  type: string;
  balance: number;
}

export class Log {
  sequence_id?: string;
  step: any;
  tx: any;
}


export class TokenBalanceQuery{
  network: string;
  contract_id: string;
  address: string;
  constructor(network: string, contract_id: string, address: string){
    this.network = network;
    this.contract_id = contract_id;
    this.address = address;
  }
}
