import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TrainingCentreModel } from '../models/training-centre-model';

import { UpdateCentreDTO } from '../dto/update-centreDTO';
import { CreateCentreDTO } from '../dto/create-centreDTO';




@Injectable({
  providedIn: 'root'
})
export class TrainingCentreService {
  private http= inject(HttpClient);
  url:string = 'trainingCenters';
  constructor() { }


  getCentros() {
    return this.http.get<TrainingCentreModel[]>(this.url);
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
