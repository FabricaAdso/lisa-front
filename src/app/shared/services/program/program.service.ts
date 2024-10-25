import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment.development';
import { CreateProgramDto } from '@shared/dto/program/create-program-dto';
import { UpdateProgramDto } from '@shared/dto/program/update-program-dto';
import { ProgramModel } from '@shared/models/program.model';

const{API_URL} = environment;



@Injectable({
  providedIn: 'root'
})
export class ProgramService {

  constructor() { }

  private http = inject(HttpClient);


  url:string = `programs`;

  

  getAll(){
    return this.http.get<ProgramModel[]>(this.url)
   
    
  }

  create(data:CreateProgramDto){
    return this.http.post<ProgramModel>(this.url, data);
  }



  delete(id:number){
    return this.http.delete(`${this.url}/${id}`)
  }

  update(data:UpdateProgramDto){
    const {id}= data;
    return this.http.put<ProgramModel>(`${this.url}/${id}`,data)
  }

  
}
