import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

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

  checkCurrentPassword(currentPassword: string): Observable<{ valid: boolean }> {
    return this.http.post<{ valid: boolean }>(
      'check-password',
      { current_password: currentPassword },
      { withCredentials: true } // 🔥 Necesario si usas Sanctum
    );
  }



  changePassword(data: ChangePasswordRequest): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.apiUrl, data);
  }


}
