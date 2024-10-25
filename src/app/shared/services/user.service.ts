import { HttpClient } from '@angular/common/http';
import { ReturnStatement } from '@angular/compiler';
import { inject, Injectable } from '@angular/core';
import { CreateUserDTO } from '@shared/dto/create-user.dto';
import { UserModel } from '@shared/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  private http = inject(HttpClient)

  URL:string = 'register'

  getAll(){
    return this.http.get<UserModel[]>(this.URL);
  }

  create(data:CreateUserDTO){
    return this.http.post<UserModel>(this.URL,data)
  }

}
