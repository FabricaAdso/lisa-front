import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {  SedeModel} from '../models/Sedemodel';
import { HttpClient } from '@angular/common/http';
import { CreateHeadquartersDTO } from '../dto/create-headquartersDTO';
import { UpdateHeadquartersDTO } from '../dto/update-headquartersDTO';
import { QueryUrl } from '@shared/models/query-url.model';
import { getQueryUrl } from '@shared/functions/url.functions';

@Injectable({
  providedIn: 'root'
})
export class HeadquartersService {

  private http = inject(HttpClient);
  url:string = 'headquarters'

  constructor() { }


  getHeadquartes(data?:QueryUrl): Observable<SedeModel[]>{

    let url:string = getQueryUrl(this.url,data)
    //console.log(url);
    
    return this.http.get<SedeModel[]>(url);
  }

  create(data:CreateHeadquartersDTO): Observable<SedeModel>{
    return this.http.post<SedeModel>(this.url,data);

  }
  update(data:SedeModel): Observable<SedeModel>{
    const {id} = data;
    return this.http.put<SedeModel>(`${this.url}/${id}`,data);

  }
  delete(id:number):Observable<void>{
    return this.http.delete<void>(`${this.url}/${id}`);

  }
}
