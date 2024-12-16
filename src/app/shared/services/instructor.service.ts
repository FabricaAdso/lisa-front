import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { getQueryUrl } from '@shared/functions/url.functions';
import { InstructorModel } from '@shared/models/instructor.model';
import { QueryUrl } from '@shared/models/query-url.model';
import { catchError, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InstructorService {

  constructor() { }

  private http = inject(HttpClient);

  URL:string = 'instructor'

  getInstructors(data?:QueryUrl){
    let URL:string = getQueryUrl(this.URL,data);
    return this.http.get<InstructorModel[]>(URL)
  }

  getInstructorByKnowledgeNetwork(knowledge_network_id:number): Observable<InstructorModel[]>{
    return this.http.get<InstructorModel[]>(`${this.URL}/?included=knowledgeNetwork,user&filter[knowledge_network_id]=${knowledge_network_id}`)
    .pipe(
      catchError((error) => {
        console.error('Error al obtener los centros de formación:', error);
        return of([]);
      })
    )
  }

}
