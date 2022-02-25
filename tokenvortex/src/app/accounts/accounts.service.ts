import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { Account } from './account';
import { environment } from 'src/environments/environment';
import { IEntity } from '../classes';
@Injectable({
  providedIn: "root",
})
export class AccountsService {
  constructor(private http: HttpClient) {
  }

  getAccounts() {
    return this.http.get(`${environment.apiUrl}/entities/account`);
  }

  updateAccount(account: Account) {
    return this.http.post(`${environment.apiUrl}/entities/update/${account._id}`, account);
  }
  
  insertAccount(account: Account) {
    return this.http.post(`${environment.apiUrl}/entities/insert`, account);
  }

  deleteAccount(account: Account) {
    return this.http.post(`${environment.apiUrl}/entities/delete/${account._id}`, account);
  }

  validateAccount(account: Account) {
    return this.http.post(`${environment.apiUrl}/entities/validate/account`, account);
  }

  lockAccount(account: Account) {
    return this.http.post(`${environment.apiUrl}/entities/lock/${account._id}`, account);
  }

  getNewAccount() {
    return this.http.get(`${environment.apiUrl}/entities/new`);
  }



  getEmptyAccount() {
    let tmpAccount = new Account();
    tmpAccount.entityType = 'account';
    tmpAccount._id = '';
    tmpAccount.body.address = '';
    tmpAccount.body.isLocked = false;
    tmpAccount.body.mnemonic = '';
    tmpAccount.name = '';
    tmpAccount.user_id = '';
    tmpAccount.body.privateKey = '';
    tmpAccount.body.publicKey = '';
    tmpAccount.body.isActive = true;
    return tmpAccount;
  }
}
