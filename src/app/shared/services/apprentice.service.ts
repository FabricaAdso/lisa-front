import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { getQueryUrl } from '@shared/functions/url.functions';
import { ApprenticeModel } from '@shared/models/apprentice.model';
import { QueryUrl } from '@shared/models/query-url.model';

@Injectable({
  providedIn: 'root'
})
export class ApprenticeService {

  constructor() { }

  private http = inject(HttpClient);

  URL:string = 'apprentice'

  getApprenticeAll(data?:QueryUrl){

    let URL:string = getQueryUrl(this.URL,data)
    console.log(URL)
    return this.http.get<ApprenticeModel[]>(URL);
  }


}
