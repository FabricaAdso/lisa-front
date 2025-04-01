import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TrainingCentreModel } from '../models/training-centre-model';

import { UpdateCentreDTO } from '../dto/update-centreDTO';
import { CreateCentreDTO } from '../dto/create-centreDTO';
import { QueryUrl } from '@shared/models/query-url.model';
import { getQueryUrl } from '@shared/functions/url.functions';
import { PaginateModel } from '@shared/models/paginate.model';
import { catchError, Observable, of } from 'rxjs';
import { TrainingCenterModel } from '@shared/models/training-center.model';




@Injectable({
  providedIn: 'root'
})
export class TrainingCentreService {
  private http= inject(HttpClient);
  url2:string = 'trainingCenters/page';
  url:string = 'trainingCenters';
  urlLogin:string = 'trainingCentersLogin'
  constructor() { }


  getCentrosPag(data?: QueryUrl) {
    let queryParams: QueryUrl = {
      included: ['regional'],  // Aquí agregamos 'regional'
      ...data // Mantiene cualquier otro parámetro existente
    };
  
    let url: string = getQueryUrl(this.url2, queryParams);
    return this.http.get<PaginateModel<TrainingCentreModel>>(url);
  }

   getCentros(data?:QueryUrl) {
  
      let url:string = getQueryUrl(this.url,data)
      console.log(url);
      return this.http.get<TrainingCenterModel[]>(url);
    }

  create(data:CreateCentreDTO){
    return this.http.post<TrainingCentreModel>(this.url,data);

  }
  update(data:UpdateCentreDTO){
    const{id} = data;
    return this.http.put<TrainingCentreModel>(`${this.url}/${id}`,data) ;

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
  

   
  checkCodeExists(code: string): Observable<{ exists: boolean }> {
    const url = `${this.url}/check-code?code=${code}`;
    return this.http.get<{ exists: boolean }>(url);
  }




 
}
