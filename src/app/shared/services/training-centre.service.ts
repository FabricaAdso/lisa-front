import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TrainingCentreModel } from '../models/training-centre-model';

import { UpdateCentreDTO } from '../dto/update-centreDTO';
import { CreateCentreDTO } from '../dto/create-centreDTO';
import { QueryUrl } from '@shared/models/query-url.model';
import { getQueryUrl } from '@shared/functions/url.functions';




@Injectable({
  providedIn: 'root'
})
export class TrainingCentreService {
  private http= inject(HttpClient);
  url:string = 'trainingCenters';
  constructor() { }


  getCentros(data?: QueryUrl) {
    let queryParams: QueryUrl = {
      included: ['regional'],  // Aquí agregamos 'regional'
      ...data // Mantiene cualquier otro parámetro existente
    };
  
    let url: string = getQueryUrl(this.url, queryParams);
    return this.http.get<TrainingCentreModel[]>(url);
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




 
}
