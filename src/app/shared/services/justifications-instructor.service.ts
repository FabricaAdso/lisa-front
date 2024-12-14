import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { getQueryUrl } from '@shared/functions/url.functions';
import { JustificationModel } from '@shared/models/justification-model';
import { PaginateModel } from '@shared/models/paginate.model';
import { QueryUrl } from '@shared/models/query-url.model';

@Injectable({
  providedIn: 'root'
})
export class JustificationsInstructorService {

  constructor() { }

  private http = inject(HttpClient);
  URL:string = 'justification/instructor'; 


  getJustifications(data?:QueryUrl){
    let url = getQueryUrl(this.URL,data)
    return  this.http.get<PaginateModel<JustificationModel>>(url)
  }
  updateJustificationStatus(id: number, newStatus: string) {
    return this.http.put(`/${id}`, { state: newStatus });
  }
  
}
