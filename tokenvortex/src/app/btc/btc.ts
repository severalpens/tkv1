import { Account } from "../accounts/account";
import { Contract } from "../contracts/contract";

export class Settings {
  constructor(){
    this.overrides = new Overrides();
  }
  user_id: string;
  sender_id: string;
  recipient_id: string;
  token_id: string;
  agent_id: string;

  senderNetwork: string;
  recipientNetwork: string;
  initialBalance: number;
  timeoutSeconds: number;
  tokenAmount: number;
  truncateDb: boolean;
  dbCollection: string;
  iterations: number;
  deploy: boolean;
  sendLogbooktoDb: boolean;
  useOverrides: boolean;
  overrides: Overrides

}

export class Overrides{
  gasLimit: number;
  gasPriceGwei: string;
}


export class Btc {
  constructor(){
    let overrides = new Overrides();
    overrides.gasLimit = 7000000;
    overrides.gasPriceGwei = "1.5";
    let settings = new Settings();
    settings.senderNetwork = 'rinkeby';
    settings.recipientNetwork = 'ropsten';
    settings.timeoutSeconds = 50;
    settings.tokenAmount = 1;
    settings.overrides = overrides;
    settings.useOverrides = false;
    this.settings = settings;
    this.balances = new Array<BtcBalance>();
  }
    
  _id?: string;
  settings: Settings;
  balances: BtcBalance[];
  results: any;
}


export class BtcTransfer{
  msgSender: Account;
  token_id: string;
  network: string;
  agentAddress: string
  amount: number;
}

export class BtcBalance {
  type: string;
  target: string;
  senderNetworkBalance: number;
  recipientNetworkBalance: number;
  tokenAmount: number;
  senderNetworkStatus: string;
  recipientNetworkStatus: string;
  senderNetworkLink: string;
  recipientNetworkLink: string;

}
