import { Component, OnInit, Input } from '@angular/core';
import { Sequence } from '../classes';

@Component({
  selector: 'sequence-header',
  templateUrl: './sequence-header.component.html',
  styleUrls: ['./sequence-header.component.css']
})
export class SequenceHeaderComponent implements OnInit {
  @Input() sequence: Sequence; 
  @Input() header: string; 
  constructor() {

   }

  ngOnInit(): void {
  }

}
