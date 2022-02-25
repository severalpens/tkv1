import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Observer, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Contract } from 'src/app/contracts/contract';
import { Account } from 'src/app/accounts/account';
import {
  Sequence,
  Step, 
  selectOptions, 
  Item,
  Method,
  ExtractedAddress,
  Transfer
} from 'src/app/classes';

import { AuthenticationService } from '../auth/_services';
import { AppService } from '../app.service';
import { ethers } from 'ethers';

@Component({
  selector: 'app-transfer-eth',
  templateUrl: './transfer-eth.component.html',
  styleUrls: ['./transfer-eth.component.css']
})
export class TransferEthComponent implements OnInit {
  account: Account;
  accounts: Array<Account>;
  address: ExtractedAddress;
  addresses: Array<ExtractedAddress>;
  amount: number;
  contracts: Array<Contract>;
  denomination: any;
  network: string;
  recipient: Account;
  recipientAddress: string;
  result: any;
  selectOptions = selectOptions;
  sequence: Sequence;
  sender: Account;
  transferResult: any;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private appService: AppService,
    public authenticationService: AuthenticationService,
    private http: HttpClient
  ) {
   
  }

  ngOnInit() {
      this.http.get(`${environment.apiUrl}/entities/account`).subscribe((accounts: Array<Account>) => {
        this.http.get(`${environment.apiUrl}/entities/contract`).subscribe((contracts: Array<Contract>) => {
        this.accounts = accounts;
        this.contracts = contracts;
        this.network = 'rinkeby';
        this.sender = this.accounts[0];
        this.recipient = this.accounts[1];
        this.amount = 250;
        this.denomination = selectOptions.denominations[5];
        this.buildOptions();
      });
    });    
}

getBalance(){
    this.http.post(`${environment.apiUrl}/sequences/eth/balance`, this.address).subscribe((balanceInWei: any) => {
      let wei = parseInt(balanceInWei._hex)
      let eth = wei * 0.000000000000000001;
      this.address.balance = eth;
    });
  }

  
transferEth(){
  let transfer = new Transfer();
  transfer.network = this.network;
  transfer.sender = this.sender;
  transfer.recipient = this.recipient;
  transfer.denomination = this.denomination;
  transfer.amount = this.amount;

  this.http.post(`${environment.apiUrl}/sequences/eth/transfer`, transfer).subscribe((result: any) => {
    this.transferResult = result;
  });
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

    this.address = this.addresses[0];
  }  
 }
