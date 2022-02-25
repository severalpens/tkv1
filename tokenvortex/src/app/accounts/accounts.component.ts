import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Account } from './account';
import { AccountsService } from './accounts.service';
import { ethers } from 'ethers';
import { IEntity } from '../classes';
const admin = '5f8f88e5d28b37394459bbba';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit {
  _id: String;
  accounts: Account[];
  account: Account;
  formHeader: String;
  isNewAccount: Boolean;
  isReadOnly: boolean;
  errorMessages: string;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private accountsService: AccountsService
  ) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      let _id = params.get('_id');
      this.accountsService.getAccounts().subscribe((accounts: IEntity[]) => {
        this.accounts = new Array<Account>();
        accounts.forEach((src) => {
          let entity = hydrateEntity(src);
          this.accounts.push(entity);
        });
        if (_id) {
          switch (_id) {
            case "random":
              let randomAccount = ethers.Wallet.createRandom();
              this.isReadOnly = false;
              this.account = new Account();
              this.account.body.address = randomAccount.address;
              this.account.body.privateKey = randomAccount.privateKey;
              this.formHeader = 'Add New Account';
              this.isNewAccount = true;
              break;
            case "existing":
              this.isReadOnly = false;
              this.account = this.accountsService.getEmptyAccount();
              this.formHeader = 'Add Account';
              this.isNewAccount = true;
              break;
            default:
              let account = accounts.find(x => x._id === _id);
              if (account) {
                this.isReadOnly = account._id == admin;
                this.account = account;
                this._id = _id;
                this.formHeader = _id;
                this.isNewAccount = false;
              } else {
                this.isReadOnly = false;
                this.account = this.accountsService.getEmptyAccount();
                this.formHeader = 'Account Not Found!';
                this.isNewAccount = true;
              }
              break;
          }
        }
        else {

        }

      });
    });

  };


  public get readOnly(): boolean {
    return this.account._id == admin;
  }



  onSelect(_id) {
    this.isReadOnly = false;
    this.router.navigateByUrl(`/accounts/${_id}`);
  }


  newExisting() {
    this.router.navigateByUrl(`/accounts/existing`);
  }

  newRandom() {
    this.router.navigateByUrl(`/accounts/random`);
  }


  delete() {
    this.accountsService.deleteAccount(this.account).subscribe((result) => {
      this.router.navigateByUrl("/accounts");
    });
  }

  update() {
      this.accountsService.updateAccount(this.account).subscribe((result) => {
        this.router.navigateByUrl("/accounts");
      });
  }

  insert() {
      this.accountsService.insertAccount(this.account).subscribe((result) => {
        this.router.navigateByUrl("/accounts");
      });
  }

  validate(){
    this.accountsService.validateAccount(this.account).subscribe((result:string) => {
      this.errorMessages = result;
    });
  }


  validateOld() {
    let result = false;
    let address = this.account.body.address.toString();
    let address0x = address.substring(0, 2)
    let privateKey = this.account.body.privateKey.toString();
    let privateKey0x = privateKey.substring(0, 2);
    if (address0x == '0x' && privateKey0x == '0x') {
      result = false;
      this.errorMessages = 'All good.'
    }
    else {
      result = true;
      this.errorMessages = '0x missing from address or privateKey'
    }

    return result;
  }

}


function hydrateEntity(src: IEntity) {
  let newEntity = new Account();

  newEntity._id = src._id;
  newEntity.user_id = src.user_id;
  newEntity.entityType = src.entityType;
  newEntity.name = src.name;
  newEntity.options = src.options;
  newEntity.body = src.body;
  newEntity.lifespan = src.lifespan;
  newEntity.buildOptions();

  return newEntity;

}