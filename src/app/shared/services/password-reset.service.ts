import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PasswordResetService {

  constructor() { }
  url:string = 'password/reset';

  private http = inject(HttpClient)

  
}
