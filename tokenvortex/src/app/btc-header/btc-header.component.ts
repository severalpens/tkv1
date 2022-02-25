import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'btc-header',
  templateUrl: './btc-header.component.html',
  styleUrls: ['./btc-header.component.css']
})
export class BtcHeaderComponent implements OnInit {
  @Input() header: string; 
  @Input() ready: boolean;

  constructor() { }

  ngOnInit(): void {
  }

}
