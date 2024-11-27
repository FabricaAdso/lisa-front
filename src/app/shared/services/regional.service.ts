import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RegionalModel } from '@shared/models/regional.model';
import { TrainingCenterModel } from '@shared/models/training-center.model';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegionalService {

  constructor() { }

  private http = inject(HttpClient);

  URL:string = 'regionals'

  getAllRegional(): Observable<RegionalModel[]>{
    return this.http.get<RegionalModel[]>(this.URL)
    .pipe(
      map((regional: RegionalModel[]) => regional),
      catchError((error: string ) => {
        console.log('Error al obtener las regionales culpa de maca excel(hace eso bien)',error);
        return of([]);
      })
    )
  } 


}
