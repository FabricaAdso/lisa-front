import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RapbysubjectModel, SubjectModel } from '@shared/models/subject-model';
import { catchError, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {

  constructor() { }

  private http = inject(HttpClient)

  URL:string = 'subject'

  getRapbysubjectModel(id:number){
    return this.http.get<RapbysubjectModel[]>(`${this.URL}/${id}`)
  }

  getSubject(){
    return this.http.get<SubjectModel[]>(`${this.URL}`)
  }

  getSubjectByCourse(courseCode: string): Observable<SubjectModel[]> {
    return this.http.get<SubjectModel[]>(`${this.URL}/?included=program,user&filter[subjectForCourse]=${courseCode}`)
      .pipe(
        catchError((error) => {
          console.error('Error al obtener los subjects:', error);
          return of([]);
        })
      );
  }



}
