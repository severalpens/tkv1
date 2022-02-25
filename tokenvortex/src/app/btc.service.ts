import { Injectable } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core'; 
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BalanceQuery } from 'src/app/classes';
import { AuthenticationService } from './auth/_services';
import { Btc } from "./btc/btc";
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
let dt = new Date();

@Injectable({
  providedIn: 'root'
})
export class BtcService {

 @Input() btc: Btc;
 balances: BalanceQuery[];
 faCheck = faCheck;
 faTimes = faTimes;
 gettingBalances: boolean;

 constructor(
  public authenticationService: AuthenticationService,
  private http: HttpClient
  ) { 
  }

  checkBalances(btc) {
    this.gettingBalances = true;
    this.http.post(`${environment.apiUrl}/btc/balances`, btc).subscribe((balances: any) => {
      this.balances = balances;
      this.gettingBalances = false;
    });
  }

  
  validateBalance(networkType: string, b: any): number{
    let isRelevant = 0;
    let isSufficient = 0;

    if(networkType === 'senderNetwork' && b.target == 'sender' && b.type==='eth' && b.senderNetworkBalance > 0.05){
      isRelevant = 1;
      isSufficient = 2;
    }
    else{
      isRelevant = 1;
    }
    if(networkType === 'recipientNetwork' && b.target == 'sender' && b.type==='eth' && b.recipientNetworkBalance > 0.05){
      isRelevant = 1;
      isSufficient = 2;
    }
    else{
      isRelevant = 1;
    }

      if(networkType === 'senderNetwork' && b.target == 'sender' && b.type==='tokens' && b.senderNetworkBalance >= this.btc.settings.tokenAmount){
        isRelevant = 1;
        isSufficient = 2;
      }
      else{
        isRelevant = 1;
      }
       
  
      if(networkType === 'recipientNetwork' && b.target == 'agent' && b.type==='tokens' && b.senderNetworkBalance >= this.btc.settings.tokenAmount){
        isRelevant = 1;
        isSufficient = 2;
      }
      else{
        isRelevant = 1;
      }   
      if(networkType === 'recipientNetwork' && b.target == 'sender' && b.type==='tokens' && b.senderNetworkBalance >= this.btc.settings.tokenAmount){
        isRelevant = 1;
        isSufficient = 2;
      }
      else{
        isRelevant = 1;
      }  
      if (b.target == 'recipient' ){
        isRelevant = 0;
        isSufficient = 0;
      }
      if (networkType == 'senderNetwork' && b.target === 'agent'){
        isRelevant = 0;
        isSufficient = 0;
      }
  

    return isRelevant + isSufficient;
  }
}



