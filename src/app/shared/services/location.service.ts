import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { despartamentosModel } from '../models/Departamentos.model';
import { municipiosModel } from '../models/municipios.model';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private http= inject(HttpClient);
  url:string = 'departaments';

  constructor() { }

  
  getDepartments() {
    return this.http.get<despartamentosModel[]>(`${this.url}`);
  }

  
  getMunicipalities(departmentId: number) {
    return this.http.get<municipiosModel[]>(`municipalities/departament/${departmentId}`);
  }
}
