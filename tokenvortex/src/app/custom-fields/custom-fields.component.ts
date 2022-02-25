import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

import {
  HashPair,
  Generic,
  selectOptions,
  IEntity,
  RandomAccount,
} from 'src/app/classes';

import { AppService } from '../app.service';
import { AuthenticationService } from '../auth/_services';

@Component({
  selector: 'app-custom-fields',
  templateUrl: './custom-fields.component.html',
  styleUrls: ['./custom-fields.component.css']
})
export class CustomFieldsComponent implements OnInit {
  saved: string;
  entities: Array<IEntity>;
  entity: IEntity;
  selectOptions = selectOptions;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private appService: AppService,
    public authenticationService: AuthenticationService,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.http.get(`${environment.apiUrl}/entities/customFields`).subscribe((entities: Array<IEntity>) => {
      this.entities = new Array<IEntity>();
      entities.forEach((src) => {
        let entity = hydrateEntity(src);
          this.entities.push(entity);
        });
    });
  }

  public get entityType(): string {
    return this.entity.entityType;
  }

  public set entityType(v: string) {
    this.entity.entityType = v;
    if (v == 'generic') {
      this.entity = new Generic();
    }
    if (v == 'hashPair') {
      this.entity = new HashPair();
    }   
    if (v == 'randomAccount') {
      this.entity = new RandomAccount();
    }
  }

  select(i) {
    this.entity = this.entities[i];
  }

  add() {
    this.entity = new Generic();
  }

  delete() {
    this.http.post(`${environment.apiUrl}/entities/delete/${this.entity._id}`, this.entity).subscribe((entities: any) => {
      this.entity =  null;
      this.ngOnInit();
    });
  }

  save() {
    this.entity.buildOptions();
    if (!this.entity._id) {
      console.log('insert');
      this.http.post(`${environment.apiUrl}/entities/insert`, this.entity).subscribe((entity: IEntity) => {
        this.entity = hydrateEntity(entity);
        this.entities.push(this.entity);
        this.saved = 'saved';
        window.setTimeout(() => {
          this.saved = '';
        }, 1000);
      });
    }
    else {
      console.log('update');
      this.http.post(`${environment.apiUrl}/entities/update/${this.entity._id}`, this.entity).subscribe((entity: IEntity) => {
        this.entity = hydrateEntity(entity);
        this.saved = 'saved';
        window.setTimeout(() => {
          this.saved = '';
        }, 1000);
      });
    }
  }

}

function hydrateEntity(src:IEntity){
  let newEntity: IEntity;
  if(src.entityType === 'generic'){
    newEntity = new Generic();
  }
  if(src.entityType === 'hashPair'){
    newEntity = new HashPair();
  }
  if(src.entityType === 'randomAccount'){
    newEntity = new RandomAccount();
  }

  newEntity._id = src._id;
  newEntity.user_id = src.user_id;
  newEntity.entityType = src.entityType;
  newEntity.name = src.name;
  newEntity.options = src.options;
  newEntity.body = src.body;
  newEntity.lifespan = src.lifespan;
  newEntity.buildOptions();

  return newEntity;

}
