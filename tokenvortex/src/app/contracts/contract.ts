import { IEntity, Item } from '../classes';

export class ContractAddresses{
  ropsten: string;
  kovan: string;
  rinkeby: string;
  goerli: string;
}

export class ContractBody{  
    contractType: string;
    decimals?: number
    symbol: string;
    name: string
    version: string;
    description: string;
    user_id: string;
    isLocked: boolean;
    addresses: ContractAddresses;
    soliditycode: string;
    bytecode: string;
    abi: Array<any>;
    constructor(){
      this.contractType = '';
      this.decimals = 0;
      this.symbol = '';
      this.name = '';
      this.version = '';
      this.description = '';
      this.user_id = '';
      this.isLocked = false;
      this.addresses = new ContractAddresses();
    this.soliditycode = '';
    this.bytecode = '';

  }
}

export class Contract implements IEntity {
  _id?: string;
  user_id?: string;
  entityType: string;
  name: string;
  body: ContractBody;
  options: Array<Item>;
  lifespan: string;
  constructor(){
    this.entityType = 'contract';
    this.body = new ContractBody();
    this.name = '';
    this.lifespan = 'static';
  }
  
  buildOptions(){
    let ropstenAddress = new Item();
    ropstenAddress.text = 'Ropsten Address';
    ropstenAddress.value = this.body.addresses.ropsten;

    let kovanAddress = new Item();
    kovanAddress.text = 'Kovan Address';
    kovanAddress.value = this.body.addresses.kovan;

    let rinkebyAddress = new Item();
    rinkebyAddress.text = 'Rinkeby Address';
    rinkebyAddress.value = this.body.addresses.rinkeby;

    let goerliAddress = new Item();
    goerliAddress.text = 'Goerli Address';
    goerliAddress.value = this.body.addresses.goerli;

    this.options = new Array<Item>();
    this.options.push(ropstenAddress);
    this.options.push(kovanAddress);
    this.options.push(rinkebyAddress);
    this.options.push(goerliAddress);


  }


  
}
