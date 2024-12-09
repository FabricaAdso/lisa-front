import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { UpdateAssistanceDTO } from '@shared/dto/update-assistance.dto';
import { getQueryUrl } from '@shared/functions/url.functions';
import { AssistanceModel } from '@shared/models/assistance.model';
import { QueryUrl } from '@shared/models/query-url.model';

@Injectable({
  providedIn: 'root'
})
export class AssistanceService {

  constructor() { }

  private http = inject(HttpClient);

  URL:string = 'assistance' 

  getAssitanceAll(data?:QueryUrl){
    let URL:string = getQueryUrl(this.URL,data)
    console.log(URL)
    return this.http.get<AssistanceModel[]>(URL)
  }

  saveAssistances(data: UpdateAssistanceDTO){
    const {id} = data;
    return this.http.put<AssistanceModel>(`${this.URL}/${id}`,data);
  } 
}
