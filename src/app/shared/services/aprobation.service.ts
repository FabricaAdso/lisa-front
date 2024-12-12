import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { getQueryUrl } from '@shared/functions/url.functions';
import { ApprovedModel } from '@shared/models/aproved-model';
import { QueryUrl } from '@shared/models/query-url.model';

@Injectable({
  providedIn: 'root'
})
export class AprobationService {

  constructor() { }

  private http = inject(HttpClient);
  URL: string = 'aprobations';


  getAprobations(data?:QueryUrl){
    let url: string = getQueryUrl(this.URL,data);
    return this.http.get<ApprovedModel[]>(url);

  }
}
