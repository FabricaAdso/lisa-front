import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
}

interface ApiResponse {
  message: string;
  success: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ChangePasswordService {

  private http = inject(HttpClient);
  private apiUrl = `change-password`;

  changePassword(data: ChangePasswordRequest): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.apiUrl, data);
  }
}
