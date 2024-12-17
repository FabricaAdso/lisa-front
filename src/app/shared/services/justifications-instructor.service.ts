import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { EstadoJustificacionEnum } from '@shared/enums/estado-justificacion.enum';
import { getQueryUrl } from '@shared/functions/url.functions';
import { JustificationModel } from '@shared/models/justification-model';
import { PaginateModel } from '@shared/models/paginate.model';
import { QueryUrl } from '@shared/models/query-url.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JustificationsInstructorService {

  constructor() { }

  private http = inject(HttpClient);
  URL:string = 'justifications'; 
  URL1:string = 'aprobations';


  getJustifications(data?:QueryUrl){
    let url = getQueryUrl(`${this.URL}/instructor`,data)
    return  this.http.get<PaginateModel<JustificationModel>>(url)
  }
  updateJustificationStatus(justificationId: number, newStatus: string): Observable<any> {
    return this.http.put(`${this.URL1}/aprobations`, {
      justification_id: justificationId,
      state: newStatus, 
    });
  }
}
