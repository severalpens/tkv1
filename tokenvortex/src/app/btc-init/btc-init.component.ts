import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Observer, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Contract } from 'src/app/contracts/contract';
import { Account } from 'src/app/accounts/account';
import { selectOptions, IEntity,  Address } from 'src/app/classes';
import { AuthenticationService } from '../auth/_services';
import { AppService } from '../app.service';
import { Btc, Overrides, Settings, BtcTransfer } from "../btc/btc";
let dt = new Date();
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'btc-init',
  templateUrl: './btc-init.component.html',
  styleUrls: ['./btc-init.component.css']
})
export class BtcInitComponent implements OnInit {
  transferred: any;
  transferring: boolean;
  btc: Btc;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private appService: AppService,
    public authenticationService: AuthenticationService,
    private http: HttpClient
  ) { }

  faCheck = faCheck;
  faTimes = faTimes;
  refreshingBalances: boolean;
  refreshed: string;

  refreshBalances(){
    this.refreshingBalances = true;
    this.http.get(`${environment.apiUrl}/balances`).subscribe((btc: Btc) => {
      this.btc = btc ? btc : new Btc();
    });
    this.refreshingBalances = false;
    this.refreshed = 'refreshed';
    window.setTimeout(() => {
      this.refreshed = '';
    }, 1000);


  }

  ngOnInit() {
    this.http.get(`${environment.apiUrl}/btc`).subscribe((btc: Btc) => {
      this.btc = btc;
    this.http.get(`${environment.apiUrl}/btc/addresses`).subscribe((agentAddresses: Array<Address>) => {
      this.agentAddresses = agentAddresses;
      this.http.get(`${environment.apiUrl}/entities`).subscribe((entities: Array<IEntity>) => {
        this.accounts = entities.filter(x => x.entityType === 'account');
        this.contracts = entities.filter(x => x.entityType === 'contract' && x.body.contractType === 'ERC20');
        this.network = selectOptions.networks[0];
        this.initialBalance = 1000;
        this.msgSender = this.accounts[0];
        this.token = this.contracts[0];
      });
    });
  });
}

  _network: string;
  _msgSender: Account;
  _token: Contract;
  accounts: Array<Account>;
  agentAddress: string;
  agentAddresses: Array<Address>;
  contracts: Array<Contract>;
  entities: Array<IEntity>;
  initialBalance: number;
  selectOptions = selectOptions;
  saved: string;
  result: any;

  public get network(): string {
    return this._network;
  }

  public set network(v: string) {
    this._network = v;
    this.agentAddress = this.agentAddresses.find(x => x.network === v).address;
  }


  public get msgSender(): Account {
    return this._msgSender;
  }

  public set msgSender(v: Account) {
    this._msgSender = v;
  }
  public get token(): Contract {
    return this._token;
  }

  public set token(v: Contract) {
    this._token = v;
  }



  run() {
    this.transferring = true;
    let transfer = new BtcTransfer();
    transfer.msgSender = this.msgSender;
    transfer.token_id = this.token._id;
    transfer.network = this.network;
    transfer.agentAddress = this.agentAddress;    
    transfer.amount = this.initialBalance;
    this.http.post(`${environment.apiUrl}/btc/initialize`, transfer).subscribe((result: any) => {
      console.log(result);
      this.transferring = false;
      this.transferred = result.transactionHash;
      // window.setTimeout(() => {
      //   this.transferred = '';
      // }, 1000);

     // this.result = result;
    });
  }



}



