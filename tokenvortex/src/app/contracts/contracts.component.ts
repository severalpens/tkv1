import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IEntity, Item, selectOptions } from '../classes';
import { Contract } from './contract';
import { ContractsService } from './contracts.service';

@Component({
  selector: 'app-contracts',
  templateUrl: './contracts.component.html',
  styleUrls: ['./contracts.component.css']
})
export class ContractsComponent implements OnInit {
  selectOptions = selectOptions;
  contracts: Contract[];
  contract: Contract;
  formHeader: String;
  newContract: Boolean;
  locked: Boolean;
  _abiString: string;
  _abiJson: any;

  constructor(
    private contractsService: ContractsService,
    private router: Router,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      let _id = params.get('_id');
    this.contractsService.getContracts().subscribe((contracts: Contract[]) => {
        this.contracts = new Array<Contract>();
        contracts.forEach((src) => {
          let entity = hydrateEntity(src);
          this.contracts.push(entity);
        });

          if (_id) {
            if (_id === 'add') {
              this.contract = new Contract();
              this.contract.entityType = 'contract';
              this.contract.body.addresses = {
                ropsten: '',
                kovan: '',
                rinkeby: '',
                goerli: '',
              };
              this.formHeader = 'Add Contract';
              this.newContract = true;
            }
            else {
              this.contract = this.contracts.find(x => x._id === _id);
              this.formHeader = this.contract.body.name;
              this.newContract = false;
            }
          }
        });
      });
  }


  get abiString(): string {
    return JSON.stringify(this.contract.body.abi);
  }

  get isReadOnly(): boolean {
   return this.contract.user_id === '5fa5f64abdae5d0a0cd54ac4';
  }

  set abiString(v: string) {
    this.contract.body.abi = JSON.parse(v);
  }

  onSelect(_id) {
    this.router.navigateByUrl(`/contracts/${_id}`);
  }

  delete() {
    this.contractsService.deleteContract(this.contract).subscribe((result) => {
      this.router.navigateByUrl("/contracts");
    });
  }

  deploy() {
    this.contract.buildOptions();
    this.contractsService.updateContract(this.contract)
    this.router.navigateByUrl(`/contractDeployment/${this.contract._id}`);
  }

  update() {
    this.contract.buildOptions();
    this.contractsService.updateContract(this.contract)
      .subscribe((result) => {
        this.router.navigateByUrl('/contracts');
      });
  }

  insert() {
    this.contract.buildOptions();
    this.contractsService.insertContract(this.contract)
      .subscribe((result) => {
        this.router.navigateByUrl('/contracts');
      });
  }


  addExisting() {
    this.router.navigateByUrl(`/contracts/add`);
  }



}


function hydrateEntity(src: Contract) {
  let newEntity = new Contract();
  newEntity._id = src._id;
  newEntity.user_id = src.user_id;
 newEntity.entityType = 'contract';
  newEntity.name = src.name;
  // newEntity.options = src.options;
  newEntity.body = src.body;
  newEntity.lifespan = src.lifespan;
  newEntity.buildOptions();

  return newEntity;

}