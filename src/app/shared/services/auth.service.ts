import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LoginDTO } from '@shared/dto/login.dto';
import { LoginModel } from '@shared/models/login.model';
import { TokenModel } from '@shared/models/token.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  private http = inject(HttpClient);

  login(data:LoginDTO){
    return this.http.post<TokenModel>(`login`,data)
  }

}