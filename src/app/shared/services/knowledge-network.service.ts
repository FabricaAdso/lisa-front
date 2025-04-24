import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { getQueryUrl } from '@shared/functions/url.functions';
import { KnowledgeNetworkByInstructorModel, KnowledgeNetworkModel } from '@shared/models/knowledg-network.model';
import { QueryUrl } from '@shared/models/query-url.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class KnowledgeNetworkService {

  constructor() { }

  private http = inject(HttpClient)

  url:string = 'knowledgeNetwork'

  getknowledgeNetwork(data?:QueryUrl):Observable<KnowledgeNetworkModel[]>{
    let url:string = getQueryUrl(this.url,data)
    return this.http.get<KnowledgeNetworkModel[]>(url)
  }



}
