import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Query } from '@angular/core';
import { environment } from '@env/environment.development';
import { getQueryUrl } from '@shared/functions/url.functions';
import { QueryUrl } from '@shared/models/query-url.model';
import { SessionModel } from '@shared/models/session.model';
import { Observable } from 'rxjs';

export interface SessionFilters {
  included?: string[]; // ['instructor.user','course.program.subjects', ...]
  course_?: string;    // valor a filtrar por course
  rap_?: string;       // valor a filtrar por rap
  subject_?: string;   // valor a filtrar por subject
  // agrega más si necesitas
}

@Injectable({
  providedIn: 'root'
})
export class ManageSessionService {

  private http = inject(HttpClient);
  URL:string ='session';

  getSessions(data?:QueryUrl) {
    let URL:string =getQueryUrl(`${this.URL}`,data)
    return this.http.get<SessionModel[]>(URL)
  }


}

