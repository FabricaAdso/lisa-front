import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { getQueryUrl } from '@shared/functions/url.functions';
import { JustificationModel } from '@shared/models/justificationModel';
import { QueryUrl } from '@shared/models/query-url.model';

@Injectable({
  providedIn: 'root'
})
export class JustificationService {

  constructor() { }

  private http = inject(HttpClient);
  url:string = `justifications`;

  getAll(data?: QueryUrl){
    let url:string = getQueryUrl(this.url,data);
    console.log(url)
    return this.http.get<JustificationModel[]>(this.url);
  }

}
