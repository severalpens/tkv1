import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Contract } from './contract';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ContractsService {
  constructor(private http: HttpClient) {
  }


  getContracts(){
    return this.http.get(`${environment.apiUrl}/entities/contract`);
  }

  updateContract(contract){
    return this.http.post(`${environment.apiUrl}/entities/update/${contract._id}`,contract);
  }

  insertContract(contract){
    return this.http.post(`${environment.apiUrl}/entities/insert`,contract);
  }
  
  deploy(contract,network,msgSender,inputs){
    console.log('deploy2 reached');

    let props = {network,msgSender,inputs}
    return this.http.post(`${environment.apiUrl}/entities/deploy/${contract._id}`,props);
  }

  deleteContract(contract){
    return this.http.post(`${environment.apiUrl}/entities/delete/${contract._id}`,contract);
  }
  lockContract(contract){
    return this.http.post(`${environment.apiUrl}/entities/lock/${contract._id}`,contract);
  }




}
