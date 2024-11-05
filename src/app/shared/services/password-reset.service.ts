import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TokenPasswordModel } from '@shared/models/token-password.model';

@Injectable({
  providedIn: 'root'
})
export class PasswordResetService {

  constructor() { }
  url:string = 'password/reset';

  private http = inject(HttpClient)

  setToken(token_access: TokenPasswordModel){
    const {token} = token_access;

    const new_token = `${token}`

    localStorage.setItem('token' , new_token);
  }

  getToken(){
    return this.http.get('token')
  }

}
