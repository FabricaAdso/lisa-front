import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Query } from '@angular/core';
import { environment } from '@env/environment.development';
import { getQueryUrl } from '@shared/functions/url.functions';
import { QueryUrl } from '@shared/models/query-url.model';
import { SessionModel } from '@shared/models/session.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ManageSessionService {

  private http = inject(HttpClient);
  URL:string ='session';

  getSessions(data?:QueryUrl) {
    let URL:string =getQueryUrl(`${this.URL}`,data)

    console.log(URL)
    return this.http.get<SessionModel[]>(URL)
  }
}

