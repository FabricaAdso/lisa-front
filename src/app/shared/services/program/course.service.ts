import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { getQueryUrl } from '@shared/functions/url.functions';
import { CourseModel } from '@shared/models/course.model';
import { QueryUrl } from '@shared/models/query-url.model';
import { SessionModel } from '@shared/models/session.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  private http = inject(HttpClient);
  url:string = 'course'
  //
  urlSessionNOw:string = 'course/sessionsNow'

  constructor() { }


  getCourses(data?:QueryUrl): Observable<CourseModel[]>{

    let url:string = getQueryUrl(this.url,data)


    return this.http.get<CourseModel[]>(url);
  }

  getCursesInstructorPending(data?:QueryUrl): Observable<SessionModel[]>{

    let url:string = getQueryUrl(`${this.url}/Instructorsessions`,data)

    return this.http.get<SessionModel[]>(url);
  }

  getCursesInstructorRecord(data?:QueryUrl): Observable<SessionModel[]>{
    let url:string = getQueryUrl(`${this.url}/sessions`,data)

    return this.http.get<SessionModel[]>(url);
  }

  getCursesInstructorNow(data?:QueryUrl){

    let urlSessionNOw:string = getQueryUrl(this.urlSessionNOw,data)

    return this.http.get<SessionModel>(urlSessionNOw);
  }


}
