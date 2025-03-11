import { HttpClient, HttpEvent } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CoursesChargeDTO } from '@shared/dto/create-courses-chargeDTO';
import { CoursesChargeModel } from '@shared/models/courses-charge.model';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChargeExcelService {

  constructor() { }
  private http = inject(HttpClient);

  url: string = 'import-';

  urlCourses: string = `${this.url}courses`
  urlApprentices: string = `${this.url}apprentices`
  urlInstructors: string = `${this.url}instructors`
  

  
  postExcelCourse(data:FormData): Observable<HttpEvent<any>>{
    return this.http.post<CoursesChargeModel[]>(this.urlCourses, data,{
      reportProgress: true,
      observe: 'events'
    });
  }
  postExcelApprentices(data:FormData){
    return this.http.post<CoursesChargeModel[]>(this.urlApprentices, data,{
      reportProgress: true,
      observe: 'events'
    });
  }
  postExcelInstructors(data:FormData){
    return this.http.post<CoursesChargeModel[]>(this.urlInstructors, data,{
      reportProgress: true,
      observe: 'events'
    });
  }


}
