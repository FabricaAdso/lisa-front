import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { getQueryUrl } from '@shared/functions/url.functions';
import { ProgramModel } from '@shared/models/program.model';
import { QueryUrl } from '@shared/models/query-url.model';

@Injectable({
  providedIn: 'root'
})
export class ProgramService {

  constructor() { }

  url:string = 'programs';

  private http = inject(HttpClient);

  getPrograms(data?:QueryUrl){
    let url = getQueryUrl(this.url, data);
    return this.http.get<ProgramModel[]>(url);
  }

}
