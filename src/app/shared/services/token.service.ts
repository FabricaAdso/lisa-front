import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LoginModel } from '@shared/models/login.model';
import { TokenModel } from '@shared/models/token.model';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() { }

  setToken(token:TokenModel){

    const {access_token,token_type} = token;
    
    const new_token  = `${token_type} ${access_token}`;

    localStorage.setItem('token',new_token);
  }

  getToken(){
    return localStorage.getItem('token');
  }

}
