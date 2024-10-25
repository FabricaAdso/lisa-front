import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { DocumentTypeModel } from '@shared/models/document-type.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentTypeService {

  constructor() { }

  private http = inject(HttpClient);

  URL:string = 'document-type'

  getAll(){
    return this.http.get<DocumentTypeModel[]>(this.URL)
  }

}
