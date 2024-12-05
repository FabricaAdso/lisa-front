import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { KnowledgeNetworkModel } from '@shared/models/knowledg-network.model';

@Injectable({
  providedIn: 'root'
})
export class KnowledgeNetworkService {

  constructor() { }

  private http = inject(HttpClient)

  URL:string = 'knowledgeNetwork'

  getKnowledgeNetwork(id:number){
    return this.http.get<KnowledgeNetworkModel[]>(`${this.URL}/${id}`)
  }



}
