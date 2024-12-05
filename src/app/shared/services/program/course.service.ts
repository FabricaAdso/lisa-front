import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { getQueryUrl } from '@shared/functions/url.functions';
import { CourseModel } from '@shared/models/course.model';
import { QueryUrl } from '@shared/models/query-url.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  private http = inject(HttpClient);
  url:string = 'courses'

  constructor() { }


  getCurses(data?:QueryUrl): Observable<CourseModel[]>{

    let url:string = getQueryUrl(this.url,data)
    
    
    return this.http.get<CourseModel[]>(url);
  }

  getCursesInstructorPending(data?:QueryUrl): Observable<CourseModel[]>{

    let url:string = getQueryUrl(`course/sessions`,data)
   
    return this.http.get<CourseModel[]>(url);
  }

  getCursesInstructorRecord(instructor_id:number,data?:QueryUrl): Observable<CourseModel[]>{

    let url:string = getQueryUrl(this.url,data)
   
    return this.http.get<CourseModel[]>(`${url}/${instructor_id}/sessions`);
  }

  getCursesInstructorNow(instructor_id:number,data?:QueryUrl): Observable<CourseModel[]>{

    let url:string = getQueryUrl(this.url,data)
   
    return this.http.get<CourseModel[]>(`${url}/${instructor_id}/sessionsNow`);
  }

  
}
