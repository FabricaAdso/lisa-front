import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HeadquartersModel } from '../models/headquarters-model';
import { HttpClient } from '@angular/common/http';
import { CreateHeadquartersDTO } from '../dto/create-headquartersDTO';
import { UpdateHeadquartersDTO } from '../dto/update-headquartersDTO';

@Injectable({
  providedIn: 'root'
})
export class HeadquartersService {

  private http = inject(HttpClient);
  url:string = 'headquartes'

  constructor() { }


  getHeadquartes(): Observable<HeadquartersModel[]>{
    return this.http.get<HeadquartersModel[]>(this.url);
  }

  create(data:CreateHeadquartersDTO): Observable<HeadquartersModel>{
    return this.http.post<HeadquartersModel>(this.url,data);

  }
  update(data:UpdateHeadquartersDTO): Observable<HeadquartersModel>{
    const {id} = data;
    return this.http.post<HeadquartersModel>(`${this.url}/${id}`,data);

  }
  delete(id:number):Observable<void>{
    return this.http.delete<void>(`${this.url}/${id}`);

  }
}
