import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { getQueryUrl } from '@shared/functions/url.functions';
import { ApprenticeModel } from '@shared/models/apprentice.model';
import { QueryUrl } from '@shared/models/query-url.model';
import { UserWithRolesData } from '@shared/models/UserWithRolesData.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApprenticeService {

  constructor() { }

  private http = inject(HttpClient);

  URL:string = 'apprentice'



  getApprenticeByUserId(userId: number): Observable<any> {
    // Usa URL absoluta sin concatenar
    return this.http.get<UserWithRolesData>(`apprentices/by-user/${userId}`);
  }
  // Mantén tus otros métodos existentes
  getApprenticeAll(data?: QueryUrl) {
    let URL: string = getQueryUrl(this.URL, data);
    return this.http.get<ApprenticeModel[]>(URL);
  }


}
