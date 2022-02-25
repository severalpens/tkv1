import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Observer, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Contract } from 'src/app/contracts/contract';
import { Account } from 'src/app/accounts/account';

import { AuthenticationService } from '../auth/_services';
import { AppService } from '../app.service';
import {
  Sequence,
  Step,
  selectOptions,
  Item,
  Method,
  Input,
  IEntity
} from 'src/app/classes';

class Block {
  _id?: string;
  blockchain: string;
  source: string;
  body: any;
}


class BlockTable {
  constructor() {
    this.headers = new Array<string>();
    this.rows = new Array<any>();
  }
  headers: Array<string>;
  rows: Array<any>;
}


@Component({
  selector: 'app-blocks',
  templateUrl: './blocks.component.html',
  styleUrls: ['./blocks.component.css']
})
export class BlocksComponent implements OnInit {
  selectOptions = selectOptions;
  saved: string;
  sequence: Sequence;
  steps: Array<Step>;
  step: Step;
  contractFields: Array<Item>;
  methods: Array<Method>;
  log: any;
  entities: any[];

  BlockVM: Array<Array<string>>;

  networks: Array<string>;
  network: string;

  msgSender: Account;
  accounts: Array<Account>;

  contracts: Array<Contract>;
  contract: Contract;

  abi: Array<Method>;
  stepMethod: Method;

  block: Block;
  blocks: Array<Block>;

  blockTable: BlockTable;

  isRunningEth: boolean;
  isRunningBtc: boolean;


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private appService: AppService,
    public authenticationService: AuthenticationService,
    private http: HttpClient
  ) {

  }

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.blocks = new Array<Block>();
    this.http.get(`${environment.apiDomain}/blocks`).subscribe((blocks: Array<Block>) => {
      this.blockTable = this.flattenBlocks(blocks);
      console.log(this.blockTable)
    });


    this.http.get(`${environment.apiDomain}/blocks/eth/status`).subscribe((result: boolean) => {
      this.isRunningEth = result;
    });

    this.http.get(`${environment.apiDomain}/blocks/btc/status`).subscribe((result: boolean) => {
      this.isRunningBtc = result;
    });

  }

  flattenBlocks(blocks: Array<Block>) {
    let blockTable = new BlockTable();
    blocks.forEach(block => {
      let row = {};
      let rowPushed = false;
      for (const key in block) {
        const blockProp = block[key];
        if (typeof blockProp !== 'object' && blockProp !== null) {
          blockTable.headers.includes(key) ?  null: blockTable.headers.push(key) ;
          row[key] = blockProp;
        }
        if(key === 'body' && block.blockchain === 'Ethereum'){
          for (const bodyKey in blockProp) {
            const bodyProp = blockProp[bodyKey];
            if (typeof bodyProp !== 'object' && bodyProp !== null) {
              blockTable.headers.includes(`body_${bodyKey}`) ?  null: blockTable.headers.push(`body_${bodyKey}`) ;
              row[`body_${bodyKey}`] = bodyProp;
            }
            if(bodyKey === 'transactions'){
              let transactions = bodyProp;
              transactions.forEach(tx => {
                let txRow = {...row}
                for(const txKey in tx){
                  const txProp = tx[txKey];
                  if (typeof txProp !== 'object' && txProp !== null) {
                    blockTable.headers.includes(`body_transaction_${txKey}`) ?  null: blockTable.headers.push(`body_transaction_${txKey}`) ;
                    txRow[`body_transaction_${txKey}`] = txKey === 'data' ? txProp.slice(0,4): txProp;
                  }
                }
                blockTable.rows.push(txRow);
                rowPushed = true;
              });
            }
          }
        }
      }
      rowPushed ? null: blockTable.rows.push(row);
    });
    blockTable.rows = blockTable.rows.slice(0,30);
    return blockTable;
  }

  resetEth() {
    this.route.paramMap.subscribe((params) => {
      this.http.get(`${environment.apiDomain}/blocks/eth/reset`).subscribe((result) => {
        location.reload();
        console.log(result)
      });
    });
  }

  startEth() {
    this.route.paramMap.subscribe((params) => {
      this.http.get(`${environment.apiDomain}/blocks/eth/start`).subscribe((result: boolean) => {
        this.isRunningEth = result;
      });
    });
  }

  stopEth() {
    this.route.paramMap.subscribe((params) => {
      this.http.get(`${environment.apiDomain}/blocks/eth/stop`).subscribe((result: boolean) => {
        this.isRunningEth = result;
      });
    });
  }

  parseInt(value) {
    if (value) {
      return parseInt(value._hex);
    }
    else {
      return '';
    }
  }


  resetBtc() {
    this.route.paramMap.subscribe((params) => {
      this.http.get(`${environment.apiDomain}/blocks/btc/reset`).subscribe((result) => {
        location.reload();
      });
    });
  }

  startBtc() {
    this.route.paramMap.subscribe((params) => {
      this.http.get(`${environment.apiDomain}/blocks/btc/start`).subscribe((result: boolean) => {
        this.isRunningBtc = result;
      });
    });
  }

  stopBtc() {
    this.route.paramMap.subscribe((params) => {
      this.http.get(`${environment.apiDomain}/blocks/btc/stop`).subscribe((result: boolean) => {
        this.isRunningBtc = result;
      });
    });
  }



}


