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
  Input,
  IEntity
} from 'src/app/classes';

import { AuthenticationService } from '../auth/_services';
import { AppService } from '../app.service';

@Component({
  selector: 'app-steps',
  templateUrl: './steps.component.html',
  styleUrls: ['./steps.component.css']
})
export class StepsComponent implements OnInit {
  selectOptions = selectOptions;
  saved: string;
  sequence: Sequence;
  steps: Array<Step>;
  step: Step;
  contractFields: Array<Item>;
  methods: Array<Method>;
  log: any;
  entities: IEntity[];
  
  
  networks: Array<string>;
  network: string;
  
  msgSender: Account;
  accounts: Array<Account>;
  
  contracts: Array<Contract>;
  contract: Contract;
  
  abi: Array<Method>;
  stepMethod: Method;

  // inputArgCats =  selectOptions.

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private appService: AppService,
    public authenticationService: AuthenticationService,
    private http: HttpClient
  ) {

  }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      let sequence_id = params.get('sequence_id');
      this.http.get(`${environment.apiUrl}/sequences/${sequence_id}`).subscribe((sequence:Sequence) => {
        this.sequence = sequence;
        this.http.get(`${environment.apiUrl}/entities`).subscribe((entities:Array<IEntity>) => {
          this.entities = entities;
          this.accounts = entities.filter(x => x.entityType === 'account');
          this.contracts = entities.filter(x => x.entityType === 'contract');
        });
      });
    });
  }

  _source_id: string;
  public set source_id(_id: string) {
    this._source_id = _id;
    let contract = this.contracts.find(x => x._id === _id);
    this.methods = contract.body.abi.filter(x => x.type === 'function');
  }

  public get source_id(): string {
    return this._source_id;
  }


  _contract_id: string;
  public set contract_id(_id: string) {
    this._contract_id = _id;
    this.step.contract_id = _id;
    let contract = this.contracts.find(x => x._id === _id);

    if(contract.body.abi){
      this.methods = contract.body.abi.filter(x => x.type === 'function');
      this.methodName = this.methods[0].name;
    }
    else{
      this.methods = [];
    }
  }

  public get contract_id(): string {
    return this._contract_id; // _contract_id is set on select(i)
  }

  getOptions(_id){
    let entity =  this.entities.find(x => x._id === _id);
    let result = entity.options;
    return result;
  }

  _methodName: string;
  public set methodName(v: string) {
    this._methodName = v;
    let abiMethod = this.methods.find(x => x.name === v);
    if(this.step.method && this.step.method.name){
      if(this.step.method.name === v){
        this._methodName = this.step.method.name;
      }
      else{
        this.step.method = new Method();
        this.step.method.name = abiMethod.name;
        this.step.method.stateMutability = abiMethod.stateMutability;
        this.step.method.type = abiMethod.type;
        this.step.method.inputs = new Array<Input>();
        abiMethod.inputs.forEach((input: Input) => {
          let tmp = new Input();
          tmp.name = input.name;
          tmp.internalType = input.internalType;
          tmp.type = input.type;
          tmp.source_id = this.entities[0]._id;
          tmp.posId = 0;      
          this.step.method.inputs.push(tmp);
        });
  
      }
    }
    else{
      this.step.method = new Method();
      this.step.method.name = abiMethod.name;
      this.step.method.stateMutability = abiMethod.stateMutability;
      this.step.method.type = abiMethod.type;
      this.step.method.inputs = new Array<Input>();
      abiMethod.inputs.forEach((input: Input) => {
        let tmp = new Input();
        tmp.name = input.name;
        tmp.internalType = input.internalType;
        tmp.type = input.type;
        tmp.source_id = this.entities[0]._id;
        tmp.posId = 0;      
        this.step.method.inputs.push(tmp);
      });

    }

  }

  public get methodName(): string {
    return this._methodName;
  }

  select(i) {
    this.step = this.sequence.steps[i];
    this._contract_id = this.step.contract_id; //bypass infinite loop of setting this.contract_id and this.step.contract_id
    let contract = this.contracts.find(x => x._id === this._contract_id); //set manually because of infinite loop
    this.methods = contract.body.abi.filter(x => x.type === 'function'); //set manually because of infinite loop
    this._methodName = this.step.method.name; //bypass infinite loop
  }

  run() {
    this.router.navigateByUrl(`/run/${this.sequence._id}`);
    // this.http.post(`${environment.apiUrl}/sequences/run`,this.step).subscribe((log: any) => {
    //   this.log = log;
    // });
  }

  add() {
    this.step = new Step();
    this.step.network = 'rinkeby';
    this.step.msgSender_id = this.accounts[0]._id;
    this.contract_id = this.contracts[0]._id;   //setting this.step.contract_id etc 
    this.methodName = this.methods[0].name;
    this.sequence.steps.push(this.step);
  }

  delete() {
    this.sequence.steps = this.sequence.steps.filter(x => x !== this.step);
    this.step = null;
    this.save(false);
  }



  save(next) {
    this.http.post(`${environment.apiUrl}/sequences/update/${this.sequence._id}`, this.sequence).subscribe((res) => {
      this.saved = 'saved';
      window.setTimeout(() => {
        this.saved = '';
      }, 1000);
      if(next){
        this.router.navigateByUrl(`/logs/${this.sequence._id}`);
      }
    });
  }

  move(direction) {
    let s = this.step;
    let currentIndex = this.sequence.steps.indexOf(s);
    if (direction === 'up') {
      let newIndex = currentIndex !== 0 ? currentIndex - 1 : 0;
      this.sequence.steps = array_move(this.sequence.steps, currentIndex, newIndex);
    }
    else {
      let newIndex = currentIndex + 1;
      this.sequence.steps = array_move(this.sequence.steps, currentIndex, newIndex);
    }
    this.save(false);
  }

  testRun() {
    this.http.post(`${environment.apiUrl}/sequences/run/test`, this.step).subscribe((result: any) => {
      this.log = result;
    });
  }

  refresh() {
  }

  //To avoid reconstructing the passed in 'method' JSON object from abi, 'internalType' field is used to store 'value'.
//   buildOptions() {
//     let arr = [];
//     let a = this.accounts.map(x => { return { type: 'account', internalType: x.address, text: x.name } });
//     let b = [];
//     this.entities.forEach(field => {
//       field.items.forEach(item => {
//         b.push({ type: 'field', internalType: item.value, text: item.text })
//       });
//     });
//     let gap = [{ type: '--', internalType: '--', text: '--' }];
//     this.selectOptions.inputs = arr.concat(a, gap, b);
//     this.selectOptions.outputs = arr.concat(a, gap, b);
//   }
}



function array_move(arr, old_index, new_index) {
  if (new_index >= arr.length) {
    var k = new_index - arr.length + 1;
    while (k--) {
      arr.push(undefined);
    }
  }
  arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
  return arr; // for testing
};
