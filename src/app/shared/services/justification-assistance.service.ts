import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { getQueryUrl } from '@shared/functions/url.functions';
import { AssistanceModel } from '@shared/models/assistance.model';
import { QueryUrl } from '@shared/models/query-url.model';

@Injectable({
  providedIn: 'root'
})
export class JustificationAssistanceService {

  constructor() { }
  private http = inject(HttpClient);

  URL:string = 'assistance' 


   // /assistance?filter[assistance]=0


   getAbsence(data?:QueryUrl){   //TRAER LAS INASITENCIAS
    let url:string = getQueryUrl(`${this.URL}?filter[assistance]': '0'`,data)
    console.log(url)
    return this.http.get<AssistanceModel[]>(url)
  }
}
