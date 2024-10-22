import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TrainingCentreModel } from '../models/training-centre-model';

import { UpdateCentreDTO } from '../dto/update-centreDTO';
import { CreateCentreDTO } from '../dto/create-centreDTO copy';



// Datos ficticios
const mockCentres = [
  { id: 1, name: 'Training Centre 1' },
  { id: 2, name: 'Training Centre 2' },
  { id: 3, name: 'Training Centre 3' }
];


@Injectable({
  providedIn: 'root'
})
export class TrainingCentreService {
  private http= inject(HttpClient);
  url:string = 'centres';
  constructor() { }


  getCentros() {
    // return this.http.get<TrainingCentreModel[]>(this.url);
    return mockCentres;
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
