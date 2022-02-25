import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Observer, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Contract } from 'src/app/contracts/contract';
import { Account } from 'src/app/accounts/account';
import { Sequence,  Step, selectOptions, Item, Method, Log, IEntity } from 'src/app/classes';
import { AuthenticationService } from '../auth/_services';
import { AppService } from '../app.service';
let dt = new Date();

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.css']
})
export class LogsComponent implements OnInit {
  saved: string;
  sequences: Array<Sequence>;
  sequence: Sequence;
  steps: Array<Step>;
  step: Step;
  log: Log;
  logs: Array<Log>;
  options: Array<Item>;
  entities: IEntity[];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private appService: AppService,
    public authenticationService: AuthenticationService,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      let sequence_id = params.get('sequence_id');
      this.http.get(`${environment.apiUrl}/sequences/${sequence_id}`).subscribe((sequence: Sequence) => {
        if (sequence) {
          this.sequence = sequence;
          this.http.get(`${environment.apiUrl}/logs/${sequence_id}`).subscribe((logs: Array<Log>) => {
            this.logs = logs;
          });
        }
      });
    });
  }

  select(i) {
    this.log = this.sequence.logs[i];
  }

  
  run() {
    this.http.get(`${environment.apiUrl}/sequences/run/${this.sequence._id}`).subscribe((sequence: Sequence) => {
        this.sequence = sequence;
        this.http.get(`${environment.apiUrl}/logs/${this.sequence._id}`).subscribe((logs: Log[]) => {
         this.logs = logs
        });
    });
  }

  delete(){
    this.http.post(`${environment.apiUrl}/logs/delete/${this.sequence._id}`,this.log).subscribe((logs: Log[]) => {
      this.logs = logs
     });
  }
  
    pop() {  
      this.sequence.logs.pop();
      this.save(false);

    }



  reset() {
    this.http.get(`${environment.apiUrl}/sequences/reset/${this.sequence._id}`).subscribe((sequence: Sequence) => {
      this.sequence = sequence;
    });

  }

  refresh() {
    this.ngOnInit();

  }



  save(next) {
    this.http.post(`${environment.apiUrl}/sequences/update/${this.sequence._id}`, this.sequence).subscribe((res) => {
      this.saved = 'saved';
      window.setTimeout(() => {
        this.saved = '';
      }, 1000);
    });
  }


}




// run() {
//   let newLog = new Log();
//   newLog.posId = this.sequence.posId;
//   newLog.seq_id = this.sequence._id;
//   newLog.status = 'table-warning';
//   let step = this.sequence.steps[this.sequence.posId];
//   if(!step){
//     console.log(' #$%#$! end of sequence #$%@#$');
//   }
//   newLog.step = step;

//   step.method.inputs.forEach((input,i) => {
//     let entity = this.entities.find(x => x._id === input.source_id);
//     let option = entity.options[input.posId];
//     newLog.step.method.inputs[i].internalType = option.value;
//   });

//   newLog.timestamp = new Date().getTime();
//   this.http.post(`${environment.apiUrl}/sequences/run`,newLog).subscribe((sequence: Sequence) => {
//       this.sequence = sequence;
//       this.updateStatus();
//       console.log(this.sequence);
//   });


// }