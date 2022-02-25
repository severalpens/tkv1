
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from 'src/app/auth/_models';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import randomWords from 'random-words';

import {
  Sequence,
} from 'src/app/classes';

import { AuthenticationService } from '../auth/_services';

@Component({
  selector: 'app-sequences',
  templateUrl: './sequences.component.html',
  styleUrls: ['./sequences.component.css']
})
export class SequencesComponent implements OnInit {
  currentUser: User;
  sequences: Array<Sequence>;
  sequence: Sequence;
  sequences$: Observable<any>;
  formHeader: string;
  user_id: string;
  isNewSequence: Boolean;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public authenticationService: AuthenticationService,
    private http: HttpClient
  ) {
    this.currentUser = this.authenticationService.currentUserValue;
    this.user_id = this.authenticationService.currentUserValue.user_id;
    this.sequences$ = this.http.get(`${environment.apiUrl}/sequences`);

  }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      let _id = params.get('sequence_id');
      this.sequences$.subscribe((sequences: Array<Sequence>) => {
            this.sequences = sequences;
            if (_id) {
              if (_id === 'new') {
                this.sequence = new Sequence(this.user_id);
                this.sequence.name = randomWords();
                this.sequence.posId  = 0;
                this.formHeader = 'Add New Sequence';
                this.isNewSequence = true;
              }
              else {
                this.sequence = this.sequences.find(x => x._id === _id);
                this.formHeader = this.sequence.name;
                this.isNewSequence = false;
              }
            }


      });
    });
  }
  
  truncatedb(){
    if(confirm('truncate db?')){
      this.http.post(`${environment.apiUrl}/sequences/truncate`,{}).subscribe((result) => {
        alert('db truncated');
        this.router.navigateByUrl(`/sequences`);
      });
    }
  }

  action(type, component,_id) {

    switch (type) {
      case 'select':
        let path = `/sequences/${_id}`;
        this.router.navigateByUrl(path);
        break;      
      case 'next':
        this.save(true);
      break;
      case 'add':
        this.router.navigateByUrl(`/sequences/new`);
        break;
      case 'save':
        this.save(false);
        break;
  
      case 'cancel':
        this.router.navigateByUrl(`/sequences`);
        break;

      case 'delete':
        this.http.post(`${environment.apiUrl}/sequences/delete/${_id}`,this.sequence).subscribe((result) => {
          this.router.navigateByUrl(`/sequences`);
        });
        break;  

      default:
        console.log('error processing action');
        break;
    }
  }
  save(next){
    if(this.sequence._id){
      this.http.post(`${environment.apiUrl}/sequences/update/${this.sequence._id}`,this.sequence).subscribe((sequence) => {
        if(!next){
          this.router.navigateByUrl(`/sequences/${this.sequence._id}`);
        }else{
          this.router.navigateByUrl(`/steps/${this.sequence._id}`);
        }
      });
    }
    else{
      this.http.post(`${environment.apiUrl}/sequences/insert`,this.sequence).subscribe((sequence: any) => {
        if(!next){
          this.router.navigateByUrl(`/sequences/${sequence._id}`);
        }else{
          this.router.navigateByUrl(`/steps/${sequence._id}`);
        }      
      });
    }   
  }

  updateFields() {
  }

}




