import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { getQueryUrl } from '@shared/functions/url.functions';
import { QueryUrl } from '@shared/models/query-url.model';
import { SubjectModel } from '@shared/models/subject-model';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {

  constructor() { }

  private http = inject(HttpClient);

  url = 'subject'

  getSubject(data?:QueryUrl){
    let url:string = getQueryUrl(this.url,data)
    return this.http.get<SubjectModel[]>(url);
  }

  postSubject(data:SubjectModel){
    return this.http.post<SubjectModel[]>(this.url,data);
  }

}
