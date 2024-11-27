import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PasswordResetDTO } from '@shared/dto/password-reset.dto';
import { PasswordResetModel } from '@shared/models/password-reset.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PasswordResetService {

  constructor() { }

  private http = inject(HttpClient);

  private url: string = 'password/reset';

  resetPassword(data:PasswordResetDTO): Observable<PasswordResetModel> {
    // return this.http.post(this.URL, { token, password });
    return this.http.post<PasswordResetModel>(this.url, data)
  }
}
