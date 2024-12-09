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


  getEnvironments(data?:QueryUrl): Observable<EnvironmentModel[]>{
    let url:string = getQueryUrl(this.url,data)
    console.log(url);
    return this.http.get<EnvironmentModel[]>(url);
  }

  create(data:CreateEvironentDTO): Observable<EnvironmentModel>{
    return this.http.post<EnvironmentModel>(this.url,data);

  }
  update(data:EnvironmentModel): Observable<EnvironmentModel>{
    const {id} = data;
    return this.http.put<EnvironmentModel>(`${this.url}/${id}`,data);

  }
  delete(id:number):Observable<void>{
    return this.http.delete<void>(`${this.url}/${id}`);

  }




}
