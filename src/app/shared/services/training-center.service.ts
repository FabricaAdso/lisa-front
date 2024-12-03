import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TrainingCenterModel } from '../models/training-center.model';

import { UpdateCentreDTO } from '../dto/update-centreDTO';
import { CreateCentreDTO } from '../dto/create-centreDTO';
import { QueryUrl } from '@shared/models/query-url.model';
import { getQueryUrl } from '@shared/functions/url.functions';
import { catchError, map, Observable, of } from 'rxjs';




@Injectable({
  providedIn: 'root'
})
export class TrainingCentreService {
  private http= inject(HttpClient);
  url:string = 'trainingCenters';
  urlLogin:string = 'trainingCentersLogin'
  constructor() { }


  getCentros(data?:QueryUrl) {

    let url:string = getQueryUrl(this.url,data)
    console.log(url);
    return this.http.get<TrainingCenterModel[]>(url);
  }

  create(data:CreateCentreDTO){
    return this.http.post<TrainingCenterModel>(this.url,data);

  }
  update(data:UpdateCentreDTO){
    const{id} = data;
    return this.http.put<TrainingCenterModel>(`${this.url}/${id}`,data) ;

  }
  delete(id:number){
    return this.http.delete(`${this.url}/${id}`);
  }


  getTrainigCentersByRegional(regional_id:number): Observable<TrainingCenterModel[]>{
    return this.http.get<TrainingCenterModel[]>(`${this.urlLogin}/?included=regional&filter[regional_id]=${regional_id}`)
    .pipe(
      catchError((error) => {
        console.error('Error al obtener los centros de formación:', error);
        return of([]);
      })
    )
  }



 
}
