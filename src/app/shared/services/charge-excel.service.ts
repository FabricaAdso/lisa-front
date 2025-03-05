import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CoursesChargeDTO } from '@shared/dto/create-courses-chargeDTO';
import { CoursesChargeModel } from '@shared/models/courses-charge.model';
import { NzUploadFile } from 'ng-zorro-antd/upload';

@Injectable({
  providedIn: 'root'
})
export class ChargeExcelService {

  constructor() { }
  private http = inject(HttpClient);

  url: string = 'import-courses';

  postExcel(data:NzUploadFile){
    return this.http.post<CoursesChargeModel[]>(this.url, data);
  }


}
