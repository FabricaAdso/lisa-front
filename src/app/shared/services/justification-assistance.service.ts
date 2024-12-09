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
    let URL:string = getQueryUrl(this.URL,data)
    console.log(URL)
    return this.http.get<AssistanceModel[]>(URL)
  }
}
