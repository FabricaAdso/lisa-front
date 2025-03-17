import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { getQueryUrl } from '@shared/functions/url.functions';
import { QueryUrl } from '@shared/models/query-url.model';
import { RapModel } from '@shared/models/rap-model';
import { catchError, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RapService {

  constructor() { }



    private http = inject(HttpClient);

    URL:string = 'rap'

    getRaps(data?:QueryUrl){
      let URL:string = getQueryUrl(this.URL,data);
      return this.http.get<RapModel[]>(URL)
    }

    getRapBySubject(rap_id:number): Observable<RapModel[]>{
      return this.http.get<RapModel[]>(`${this.URL}/?included=rap,user&filter[subject_id]=${rap_id}`)
      .pipe(
        catchError((error) => {
          console.error('Error al obtener los centros de formación:', error);
          return of([]);
        })
      )
    }
}
