import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { getQueryUrl } from '@shared/functions/url.functions';
import { JustificationModel } from '@shared/models/justification-model';
import { QueryUrl } from '@shared/models/query-url.model';

@Injectable({
  providedIn: 'root'
})
export class JustificationService {

  constructor() { }

  private http = inject(HttpClient);
  URL:string = 'justification/apprentice'; 


  getJustifications(data?:QueryUrl){
    let url = getQueryUrl(this.URL,data)
    return  this.http.get<JustificationModel[]>(url)
  }
}
