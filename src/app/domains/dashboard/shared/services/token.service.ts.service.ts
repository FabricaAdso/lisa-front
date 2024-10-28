import { Injectable } from '@angular/core';
import { TokenModel } from '../models/token.model';


@Injectable({
  providedIn: 'root'
})
export class TokenServiceTsService {

  setToken(token:TokenModel){
    const {access_token, token_type} = token;

    const new_token = `${token_type} ${access_token}`
    
    localStorage.setItem('token', new_token);

  }

  getToken(){
    return localStorage.getItem('token');
  }
}
