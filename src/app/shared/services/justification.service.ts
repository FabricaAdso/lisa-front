import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { getQueryUrl } from '@shared/functions/url.functions';
import { JustificationModel } from '@shared/models/justification-model';
import { QueryUrl } from '@shared/models/query-url.model';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JustificationService {

  constructor() { }

  private http = inject(HttpClient);
  //
  URL:string = 'justification/apprentice'; 
  enviarJustificacion:string = 'justifications'


  getJustifications(data?:QueryUrl){
    let url = getQueryUrl(this.URL,data)
    return  this.http.get<JustificationModel[]>(url)
  }
  setJustificacion(item: JustificationModel,data_url?:QueryUrl) {
    console.log('Contenido de item:', item);
    var formData = new FormData();
    formData.append('_method',"PUT");
    formData.append('file', item.file!);
    formData.append('description', item.description! );
    formData.append('assistance_id', item.assistance_id!?.toString());
    let url = getQueryUrl(this.enviarJustificacion,data_url);
    return this.http.post<JustificationModel>(url, formData);
  }
}
