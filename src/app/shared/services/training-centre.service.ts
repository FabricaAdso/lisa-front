import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TrainingCentreModel } from '../models/training-centre-model';

import { UpdateCentreDTO } from '../dto/update-centreDTO';
import { CreateCentreDTO } from '../dto/create-centreDTO';
import { QueryUrl } from '@shared/models/query-url.model';
import { getQueryUrl } from '@shared/functions/url.functions';
import { PaginateModel } from '@shared/models/paginate.model';
import { Observable } from 'rxjs';




@Injectable({
  providedIn: 'root'
})
export class TrainingCentreService {
  private http= inject(HttpClient);
  url:string = 'trainingCenters/page';
  url2:string = 'trainingCenters';
  constructor() { }


  getCentros(data?: QueryUrl) {
    let queryParams: QueryUrl = {
      included: ['regional'],  // Aquí agregamos 'regional'
      ...data // Mantiene cualquier otro parámetro existente
    };
  
    let url: string = getQueryUrl(this.url, queryParams);
    return this.http.get<PaginateModel<TrainingCentreModel>>(url);
  }

  create(data:CreateCentreDTO){
    return this.http.post<TrainingCentreModel>(this.url2,data);

  }
  update(data:UpdateCentreDTO){
    const{id} = data;
    return this.http.put<TrainingCentreModel>(`${this.url2}/${id}`,data) ;

  }
  delete(id:number){
    return this.http.delete(`${this.url2}/${id}`);
  }

   
  checkCodeExists(code: string): Observable<{ exists: boolean }> {
    const url = `${this.url2}/check-code?code=${code}`;
    return this.http.get<{ exists: boolean }>(url);
  }




 
}
