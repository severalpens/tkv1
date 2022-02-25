import { Component, OnInit, Input } from '@angular/core';
import { Contract } from 'ethers';

@Component({
  selector: 'app-contract-readonly',
  templateUrl: './contract-readonly.component.html',
  styleUrls: ['./contract-readonly.component.css']
})
export class ContractReadonlyComponent implements OnInit {
@Input() c;
  constructor() { }

  ngOnInit(): void {
  }

}
