import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Observer, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Contract } from 'src/app/contracts/contract';
import { Account } from 'src/app/accounts/account';
import {
  Sequence,
  selectOptions,
  BalanceQuery,
  TokenTransfer,
  ExtractedAddress,
  TokenBalanceQuery
} from 'src/app/classes';

import { AuthenticationService } from '../auth/_services';
import { AppService } from '../app.service';
import { ethers } from 'ethers';

@Component({
  selector: 'app-transfer-token',
  templateUrl: './transfer-token.component.html',
  styleUrls: ['./transfer-token.component.css']
})
export class TransferTokenComponent implements OnInit {
  account: Account;
  accounts: Array<Account>;
  address: ExtractedAddress;
  addresses: Array<ExtractedAddress>;
  amount: number;
  _contract: Contract;
  contracts: Array<Contract>;
  denomination: any;
  from: Account;
  msgSender: Account;
  _network: string;
  recipient: Account;
  result: any;
  selectOptions = selectOptions;
  sender: Account;
  sequence: Sequence;
  to: ExtractedAddress;
  transferResult: any;
  tokenBalanceQuery: TokenBalanceQuery;
  balance: number;
  contractAddress: string;
  networkAddresses: ExtractedAddress[];
  balanceReceived: boolean;



  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private appService: AppService,
    public authenticationService: AuthenticationService,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.http.get(`${environment.apiUrl}/entities/account`).subscribe((accounts: Array<Account>) => {
      this.http.get(`${environment.apiUrl}/entities/contract`).subscribe((contracts: Array<Contract>) => {
        this.accounts = accounts;
        this.msgSender  =  accounts[0];
        this.contracts = contracts.filter(x => x.body.contractType === 'ERC20');
        this.contract = this.contracts[0];
        this.network = 'rinkeby';
        this.amount = 1;
        this.buildOptions();
      });
    });
  }

  
  public get network() : string {
    return this._network;
  }

  
  public set network(v : string) {
    this._network = v;
    this.contractAddress = this._contract.body.addresses[this._network];
    if(this.network && this.addresses){
      this.networkAddresses = this.addresses.filter(x => x.network === this.network);
    }

    this.balance = null;
  }
  
    
  public get contract() : Contract {
    return this._contract;
  }

  
  public set contract(v : Contract) {
    this._contract = v;
    this.contractAddress = this._contract.body.addresses[this._network];
    this.balance = null;
  }
  

  buildOptions() {
    this.addresses = new Array<ExtractedAddress>();
    selectOptions.networks.forEach(network => {
      this.accounts.forEach(account => {
        this.addresses.push(new ExtractedAddress(account.name,'account', network,account.body.address));
      });

      this.contracts.forEach(contract => {
        this.addresses.push(new ExtractedAddress(contract.name,'contract', network,contract.body.addresses[network]));
      });
    });
    this.networkAddresses = this.addresses.filter(x => x.network === this.network);
  }  
 

  getBalance() {
    let transfer = new TokenTransfer();
    transfer.contract_id = this.contract._id;
    transfer.network = this.network;
    transfer.msgSender = this.msgSender;
    transfer.recipient = this.address;
    transfer.amount = this.amount;
    this.http.post(`${environment.apiUrl}/sequences/token/balance`,transfer).subscribe((balance: any) => {
      console.log(balance);
      this.balanceReceived=true;
      this.balance = balance;
    });
  }

  
  
transferToken(){
  let transfer = new TokenTransfer();
  transfer.contract_id = this.contract._id;
  transfer.network = this.network;
  transfer.msgSender = this.msgSender;
  transfer.recipient = this.address;
  transfer.amount = this.amount;

  this.http.post(`${environment.apiUrl}/sequences/token/transfer`, transfer).subscribe((result: any) => {
   this.transferResult = result;
  });
}

}
