import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CreateHeadquartersDTO } from '../dto/create-headquartersDTO';
import { UpdateHeadquartersDTO } from '../dto/update-headquartersDTO';
import { QueryUrl } from '@shared/models/query-url.model';
import { getQueryUrl } from '@shared/functions/url.functions';
import { HeadquarterModel } from '@shared/models/headquarter.model';

@Injectable({
  providedIn: 'root'
})
export class HeadquartersService {

  private http = inject(HttpClient);
  url:string = 'headquarters'

  constructor() { }


  getHeadquarters(data?:QueryUrl){

    let url:string = getQueryUrl(this.url,data)
    console.log(url);

    return this.http.get<HeadquarterModel[]>(url);
  }

  create(data:CreateHeadquartersDTO): Observable<HeadquarterModel>{
    return this.http.post<HeadquarterModel>(this.url,data);

  }
  update(data:UpdateHeadquartersDTO): Observable<HeadquarterModel>{
    const {id} = data;
    return this.http.put<HeadquarterModel>(`${this.url}/${id}`,data);

  }
  delete(id:number):Observable<void>{
    return this.http.delete<void>(`${this.url}/${id}`);

  }
}
