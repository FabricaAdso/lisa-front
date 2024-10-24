import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
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

}
