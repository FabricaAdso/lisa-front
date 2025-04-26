import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { getQueryUrl } from '@shared/functions/url.functions';
import { CourseModel } from '@shared/models/course.model';
import { QueryUrl } from '@shared/models/query-url.model';
import { PaginatedResponse, SessionModel } from '@shared/models/session.model';
import { SubjectModel } from '@shared/models/subject-model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  private http = inject(HttpClient);
  url: string = 'course'
  urlCourses: string = 'courses'
  //
  urlSessionNOw: string = 'course/sessionsNow'

  constructor() { }
  getCourses(data?: QueryUrl): Observable<CourseModel[]> {
    let url: string = getQueryUrl(this.url, data)
    return this.http.get<CourseModel[]>(url);
  }
  
  getCourseSearch(data:string){
    return this.http.get<CourseModel[]>(`${this.urlCourses}/search?code=${data}`)
  }

  getCoursesPage(data?: QueryUrl): Observable<PaginatedResponse<CourseModel>> {
    const url = getQueryUrl(this.urlCourses, data);
    return this.http.get<PaginatedResponse<CourseModel>>(url);
  }

  getCourseSessionsNow(data?: QueryUrl): Observable<SessionModel[]> {

     let url: string = getQueryUrl(`${this.url}/sessionsNow`, data)

    return this.http.get<SessionModel[]>(url);
  }
  
  getCouurseSessionsPast(data?: QueryUrl): Observable<SessionModel[]> {

    let url: string = getQueryUrl(`${this.url}/sessions`, data)

    return this.http.get<SessionModel[]>(url);
  }

  getCursesInstructorNow(data?: QueryUrl) {

    let urlSessionNOw: string = getQueryUrl(this.urlSessionNOw, data)

    return this.http.get<SessionModel>(urlSessionNOw);
  }

  getCourseLeader(): Observable<CourseModel[]> {
    return this.http.get<CourseModel[]>(`${this.url}/leader`);
  }


}
