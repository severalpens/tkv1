
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AccountsService } from '../accounts/accounts.service';
import { IEntity, Item, selectOptions, Input } from '../classes';
import { Contract } from '../contracts/contract';
import { ContractsService } from '../contracts/contracts.service';

@Component({
  selector: 'app-contract-deployment',
  templateUrl: './contract-deployment.component.html',
  styleUrls: ['./contract-deployment.component.css']
})
export class ContractDeploymentComponent implements OnInit {

  selectOptions = selectOptions;
  contracts: Contract[];
  contract: Contract;
  formHeader: String;
  newContract: Boolean;
  locked: Boolean;
  _abiString: string;
  _abiJson: any;
  _network: string;
  address: string;
  input: Input;
  name: string;
  type: string;
  msgSender: Account;
  value: string;
  internalType: string;
  inputs: Array<Input>;
  accounts: Account[];
  result: any;

  constructor(
    private contractsService: ContractsService,
    private accountsService: AccountsService,
    private router: Router,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      let _id = params.get('_id');
      this.contractsService.getContracts().subscribe((contracts: Contract[]) => {
        this.accountsService.getAccounts().subscribe((accounts: Account[]) => {
          this.contracts = contracts;
          this.accounts = accounts;
          this.contract = this.contracts.find(x => x._id === _id);
          let constructor = this.contract.body.abi.find(x => x.type === 'constructor');
          this.inputs = constructor && constructor.inputs ? constructor.inputs: [];
          this.network = 'rinkeby';
          this.msgSender = accounts[0];
            if(this.inputs[0]){
              if(this.inputs[0].name === 'initialBalance'){
                let initialvalue = 10000 * 10**this.contract.body.decimals;
                this.inputs[0].value = initialvalue.toString();
              }
          }
        });
      });
    });
  }

  
  public get network(): string {
    return this._network;
  }

  public set network(v: string) {
    this.address = this.contract.body.addresses[v];
    this._network = v;
  }

  onSelect(_id) {
    this.router.navigateByUrl(`/contractDeployment/${_id}`);
  }


  deploy() {
    console.log('deploy reached');

    this.contractsService.deploy(this.contract,this.network, this.msgSender,this.inputs).subscribe((result:any) => {
      this.result = result;
      this.contract.body.addresses[this.network] = result.address;
      this.contractsService.updateContract(this.contract).subscribe((result) => {
        //this.router.navigateByUrl(`/contractDeployment/${this.contract._id}`);
        this.router.navigateByUrl(`/contractDeployment/`);
      })
    });
  }



}

