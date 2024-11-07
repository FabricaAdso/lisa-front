import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { EnvironmentModel } from '../models/environment-model';
import { Observable } from 'rxjs';
import { CreateEvironentDTO } from '../dto/create-environmentDTO';
import { QueryUrl } from '@shared/models/query-url.model';
import { getQueryUrl } from '@shared/functions/url.functions';


@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {
  private http = inject(HttpClient);
  url:string = 'environments'

  constructor() { }


  get(data?:QueryUrl): Observable<EnvironmentModel[]>{
    let url:string = getQueryUrl(this.url,data)
    //console.log(url);
    return this.http.get<EnvironmentModel[]>(url);
  }

  create(data:CreateEvironentDTO,data_url?:QueryUrl): Observable<EnvironmentModel>{
    let url:string = getQueryUrl(this.url,data_url);
    return this.http.post<EnvironmentModel>(url,data);

  }
  update(data:EnvironmentModel,data_url?:QueryUrl): Observable<EnvironmentModel>{
    const {id} = data;
    let url:string = getQueryUrl(`${this.url}/${id}`, data_url )
    return this.http.put<EnvironmentModel>(url,data);

  }
  delete(id:number):Observable<void>{
    return this.http.delete<void>(`${this.url}/${id}`);

  }




}
