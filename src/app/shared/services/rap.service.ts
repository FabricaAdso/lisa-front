import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { getQueryUrl } from '@shared/functions/url.functions';
import { QueryUrl } from '@shared/models/query-url.model';
import { RapModel } from '@shared/models/rap-model';

@Injectable({
  providedIn: 'root'
})
export class RapService {

  constructor() { }


  private http = inject(HttpClient);

  url = 'rap'

  getRap(data?:QueryUrl){
    let url:string = getQueryUrl(this.url,data)
    return this.http.get<RapModel[]>(`${url}`);
  }

  getRapBySubject(subject_id:number, data?:QueryUrl){
    let url:string = getQueryUrl(this.url,data)
    return this.http.get<RapModel[]>(`${url}&filter[subject_id]=${subject_id}`)
  }

  postRap(data:RapModel){
    return this.http.post<RapModel[]>(this.url,data);
  }

}
