import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import {  Step, selectOptions, Item, Method, Log, IEntity, Address } from 'src/app/classes';
import { AuthenticationService } from '../auth/_services';
import { AppService } from '../app.service';
import { Btc, Overrides, Settings } from "../btc/btc";
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

let dt = new Date();

@Component({
  selector: 'btc-transfer',
  templateUrl: './btc-transfer.component.html',
  styleUrls: ['./btc-transfer.component.css']
})
export class BtcTransferComponent implements OnInit {
  log: Log;
  logs: Array<Log>;
  saved: string;
  btc: Btc;
  status: string;
  agentAddresses: Array<Address>;
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
  ) { }

  ngOnInit() {
    this.http.get(`${environment.apiUrl}/btc`).subscribe((btc: Btc) => {
      this.btc = btc ? btc : new Btc();
    });
  }

  run() {
    this.http.post(`${environment.apiUrl}/btc/transfer`, this.btc).subscribe((status: string) => {
        this.status = status;
    });
  }

  reset() {
    this.http.get(`${environment.apiUrl}/btc/reset/${this.btc._id}`).subscribe((btc: any) => {
      this.btc = btc;
    });

  }

  refresh() {
    this.http.get(`${environment.apiUrl}/btc`).subscribe((btc: Btc) => {
      this.btc = btc;
    });
  }



}



