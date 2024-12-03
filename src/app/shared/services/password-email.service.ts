import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PasswordEmailDTO } from '@shared/dto/password-email.dto';
import { PasswordEmailModel } from '@shared/models/password-email.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PasswordEmailService {

  url:string = 'password/email';
  constructor() { }

  private http = inject(HttpClient);

  getUser() {
    return this.http.get<PasswordEmailModel[]>(`${this.url}`);
  }

  postEmail(data:PasswordEmailDTO){
    return this.http.post<PasswordEmailModel>(`${this.url}`, data);
  }




}
