import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { selectOptions, IEntity, BalanceQuery } from 'src/app/classes';
import { AuthenticationService } from '../auth/_services';
import { AppService } from '../app.service';
import { Btc, Overrides, Settings } from "./btc";
let dt = new Date();

@Component({
  selector: 'btc',
  templateUrl: './btc.component.html',
  styleUrls: ['./btc.component.css']
})
export class BtcComponent implements OnInit {
  section: string;
  btc: Btc;
  ready: boolean;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private appService: AppService,
    public authenticationService: AuthenticationService,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.ready = false;
    this.route.paramMap.subscribe((params) => {
      this.section = params.get('section');
        // this.http.get(`${environment.apiUrl}/btc`).subscribe((btc: Btc) => {
        //   this.btc = btc;
        // });
    });
  }

}



