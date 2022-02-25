import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Contract } from 'src/app/contracts/contract';
import { Account } from 'src/app/accounts/account';
import { Sequence, Step, selectOptions, IEntity, BalanceQuery } from 'src/app/classes';
import { AuthenticationService } from '../auth/_services';
import { AppService } from '../app.service';
import { Btc, BtcBalance, Overrides, Settings } from "../btc/btc";
import { Output, EventEmitter } from '@angular/core';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'btc-balances',
  templateUrl: './btc-balances.component.html',
  styleUrls: ['./btc-balances.component.css']
})
export class BtcBalancesComponent implements OnInit {
  b: Btc;
  faCheck = faCheck;
  faTimes = faTimes;
  refreshingBalances: boolean;
  refreshed: string;
  recalculatingBalances: boolean;
  recalculated: string;

  recalculateBalances() {
    this.recalculatingBalances = true;
    this.http.get(`${environment.apiUrl}/btc/balances`).subscribe((btc: Btc) => {
      this.b = btc;
      this.recalculatingBalances = false;
      this.recalculated = 'recalculated';
      window.setTimeout(() => {
        this.recalculated = '';
      }, 1000);
    });
  }

  refreshBalances(){
    this.refreshingBalances = true;
    this.http.get(`${environment.apiUrl}/btc`).subscribe((btc: Btc) => {
      this.b = btc;
      this.refreshingBalances = false;
      this.refreshed = 'refreshed';
      window.setTimeout(() => {
        this.refreshed = '';
      }, 1000);
    });
    }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private appService: AppService,
    public authenticationService: AuthenticationService,
    private http: HttpClient
  ) {
  }

  ngOnInit() {
    this.http.get(`${environment.apiUrl}/btc`).subscribe((btc: Btc) => {
      this.b = btc;

    });
  }





}



