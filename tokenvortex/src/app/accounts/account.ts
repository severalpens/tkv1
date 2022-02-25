import { IEntity, Item } from '../classes';

export class AccountBody{
  address: string;
  privateKey: string;
  publicKey: string;
  mnemonic: string;
  isLocked: boolean;
  isActive: boolean;
  shortAddress: string;
  ethBalance: number;
}


export class Account implements IEntity
  {
    _id?: string;
    user_id?: string;
    entityType: string;
    name: string;
    body: AccountBody;
    options: Array<Item>;
    lifespan: string;
    constructor(){
      this.entityType = 'account';
      this.body = new AccountBody();
    }

    buildOptions(){
      let item = new Item();
      item.value = this.body.address;
      item.text = 'Address';
      this.options = new Array<Item>();
      this.options.push(item);
    }
  }

