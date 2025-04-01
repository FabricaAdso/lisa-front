import { HttpClient } from '@angular/common/http';
import { ReturnStatement } from '@angular/compiler';
import { inject, Injectable } from '@angular/core';
import { CreateUserDTO } from '@shared/dto/create-user.dto';
import { getQueryUrl } from '@shared/functions/url.functions';
import { QueryUrl } from '@shared/models/query-url.model';
import { UserModel } from '@shared/models/user.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  
  private http = inject(HttpClient)
  url:string = 'users'
  constructor() { }

  getAllUsers(data?:QueryUrl):Observable<UserModel[]>{
     let url:string = getQueryUrl(this.url,data)
     console.log(url);
     
     return this.http.get<UserModel[]>(url)
  }
  getUsersByTrainingCenter(){
    
  }

  create(data:CreateUserDTO){
    return this.http.post<UserModel>(this.url,data)
  }

}
