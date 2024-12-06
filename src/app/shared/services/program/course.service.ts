import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CourseModel } from '@shared/models/course.model';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  constructor() { }

  private http = inject(HttpClient)

  URL:string = 'courses'

  getCourse(){
    return this.http.get<CourseModel[]>(`${this.URL}`)
  }

}
