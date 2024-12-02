import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CreateSessionDto } from '@shared/dto/program/create-session-dto';
import { UpdateCourseDto } from '@shared/dto/program/update-course-dto';
import { SessionModel } from '@shared/models/session.model';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor() { }

  private http = inject(HttpClient);


  url:string = `sessions`;



  getAll(){
    return this.http.get<SessionModel[]>(this.url)


  }

  create(data:CreateSessionDto){
    return this.http.post<SessionModel>(this.url, data);
  }



  delete(id:number){
    return this.http.delete(`${this.url}/${id}`)
  }

  update(data:UpdateCourseDto){
    const {id}= data;
    return this.http.put<SessionModel>(`${this.url}/${id}`,data)
  }
}
