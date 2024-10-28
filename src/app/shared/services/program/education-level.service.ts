import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { EducationLevelModel } from '@shared/models/education-level.model';

@Injectable({
  providedIn: 'root'
})
export class EducationLevelService {

  private http = inject(HttpClient);
  url:string = `educationLevel`;


  getAll(){
    return this.http.get<EducationLevelModel[]>(this.url)
  }

  createLevel(data:any){
    return this.http.post<EducationLevelModel>(this.url,data)
  }
}
