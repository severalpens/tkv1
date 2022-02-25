import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Contract } from 'src/app/contracts/contract';
import { Account } from 'src/app/accounts/account';
import { Sequence, Step, selectOptions, IEntity, BalanceQuery } from 'src/app/classes';
import { AuthenticationService } from '../auth/_services';
import { AppService } from '../app.service';
import { Btc, Overrides, Settings } from "../btc/btc";
import { Output, EventEmitter } from '@angular/core';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

let dt = new Date();
@Component({
  selector: 'btc-settings',
  templateUrl: './btc-settings.component.html',
  styleUrls: ['./btc-settings.component.css']
})
export class BtcSettingsComponent implements OnInit {
  btc: Btc;
  updating: boolean;
 // @Output() updating = new EventEmitter<boolean>();
  selectOptions = selectOptions;
  saved: string;
  entities: Array<IEntity>;
  accounts: Array<Account>;
  contracts: Array<Contract>;
  _admin: Account;
  _sender: Account;
  _recipient: Account;
  _agent: Contract;
  _token: Contract;
  _useOverrides: boolean;
  agentAddress: string;
  faCheck = faCheck;
  faTimes = faTimes;
  refreshingBalances: boolean;
  refreshed: string;

  refreshBalances(){
    this.refreshingBalances = true;
    this.http.get(`${environment.apiUrl}/balances`).subscribe((btc: Btc) => {
      this.btc = btc;
    });
    this.refreshingBalances = false;
    this.refreshed = 'refreshed';
    window.setTimeout(() => {
      this.refreshed = '';
    }, 1000);
  }

 constructor(
    private router: Router,
    private route: ActivatedRoute,
    private appService: AppService,
    public authenticationService: AuthenticationService,
    private http: HttpClient
  ) {
    this.updating = false;
   }

  ngOnInit() {      
    this.http.get(`${environment.apiUrl}/btc`).subscribe((btc: Btc) => {
      this.btc = btc ? btc : new Btc();
      this.http.get(`${environment.apiUrl}/entities`).subscribe((entities: Array<IEntity>) => {
        this.accounts = entities.filter(x => x.entityType === 'account');
        this.contracts = entities.filter(x => x.entityType === 'contract');
        this._sender = entities.find(x => x._id === this.btc.settings.sender_id);
        this._recipient = entities.find(x => x._id === this.btc.settings.recipient_id);
        this._token = entities.find(x => x._id === this.btc.settings.token_id);
        this._agent = entities.find(x => x._id === this.btc.settings.agent_id);
      });
    });
  }


  public get sender(): Account {
    return this._sender;
  }

  public set sender(v: Account) {
    this._sender = v;
    this.btc.settings.sender_id = v._id;

  }

  public get recipient(): Account {
    return this._recipient;
  }

  public set recipient(v: Account) {
    this._recipient = v;
    this.btc.settings.recipient_id = v._id;

  }
  public get useOverrides(): boolean {
    return this.btc.settings.useOverrides;
  }

  public set useOverrides(v: boolean) {
    console.log(v);
    this._useOverrides = v;
    this.btc.settings.useOverrides = v;

  }
  
  public get token(): Contract {
    return this._token;
  }

  public set token(v: Contract) {
    this._token = v;
    this.btc.settings.token_id = v._id;

  }


  public get agent(): Contract {
    return this._agent;
  }

  public set agent(v: Contract) {
    this._agent = v;
    this.btc.settings.agent_id = v._id;

  }



  save() {
   this.updating = true;
    if(this.btc._id){
      console.log('update');
      this.http.post(`${environment.apiUrl}/btc/update`, this.btc).subscribe((btc: Btc) => {
        this.updating = false;
        console.log(btc);
        // this.btc = btc;
        console.log(this.btc);
        this.saved = 'saved';
        window.setTimeout(() => {
          this.saved = '';
        }, 1000);
      });
    }
    else{
      console.log('insert');
      this.http.post(`${environment.apiUrl}/btc/insert`, this.btc).subscribe((btc:Btc) => {
        this.updating = false;
        console.log(btc);
        // this.btc = btc;
        this.saved = 'saved';
        window.setTimeout(() => {
          this.saved = '';
        }, 1000);
      });
  
    }
  }


}



