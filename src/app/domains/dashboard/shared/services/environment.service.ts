import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { EnvironmentModel } from '../models/environment-model';
import { Observable } from 'rxjs';
import { CreateEvironentDTO } from '../dto/create-environmentDTO';


@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {
  private http = inject(HttpClient);
  url:string = 'environments'

  constructor() { }


  get(): Observable<EnvironmentModel[]>{
    return this.http.get<EnvironmentModel[]>(this.url);
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
