import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { getQueryUrl } from '@shared/functions/url.functions';
import { InstructorModel } from '@shared/models/instructor.model';
import { QueryUrl } from '@shared/models/query-url.model';
import { UserWithRolesData } from '@shared/models/UserWithRolesData.model';
import { catchError, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InstructorService {

  constructor() { }

  private http = inject(HttpClient);

  URL:string = 'instructor'

  getInstructorByUserId(userId: number): Observable<any> {
    return this.http.get<UserWithRolesData>(`instructors/by-user/${userId}`);
  }

  getInstructors(data?:QueryUrl){
    let URL:string = getQueryUrl(this.URL,data);
    return this.http.get<InstructorModel[]>(URL)
  }

  getInstructorByKnowledgeNetwork(knowledge_network_id:number): Observable<InstructorModel[]>{
    return this.http.get<InstructorModel[]>(`${this.URL}/?included=knowledgeNetwork,user&filter[knowledge_network_id]=${knowledge_network_id}&filter[state]=activo`)
    .pipe(
      catchError((error) => {
        console.error('Error al obtener los centros de formación:', error);
        return of([]);
      })
    )


  }


  gettInstructors(queryParams?: { included?: string }): Observable<InstructorModel[]> {
    let params = new HttpParams();
    if (queryParams && queryParams.included) {
      params = params.set('included', queryParams.included);
    }
    return this.http.get<InstructorModel[]>(this.URL, { params });
  }
}
