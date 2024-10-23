import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private http= inject(HttpClient);
  url:string = 'location';

  constructor() { }

  
  getDepartments() {
    return this.http.get<string[]>(`${this.url}/departments`);
  }

  
  getMunicipalities(departmentId: number) {
    return this.http.get<string[]>(`${this.url}/departments/${departmentId}/municipalities`);
  }
}
