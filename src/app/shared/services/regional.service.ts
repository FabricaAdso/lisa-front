import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RegionalModel } from '@shared/models/regional.model';

@Injectable({
  providedIn: 'root'
})
export class RegionalService {

  constructor() { }

  private http = inject(HttpClient);

  URL:string = 'regionals'

  getAllRegional(){
    return this.http.get<RegionalModel[]>(this.URL)
  } 

}
