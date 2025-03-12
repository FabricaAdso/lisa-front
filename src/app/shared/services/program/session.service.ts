import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CreateSessionDTO } from '@shared/dto/create-session.dto';
import { UpdateCourseDto } from '@shared/dto/program/update-course-dto';
import { getQueryUrl } from '@shared/functions/url.functions';
import { QueryUrl } from '@shared/models/query-url.model';
import { SessionModel } from '@shared/models/session.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor() { }

  private http = inject(HttpClient);

  url:string = 'session';

  getSessionShow(id:number,data?:QueryUrl){
    let url:string = getQueryUrl(`${this.url}/${id}`,data);
    return this.http.get<SessionModel>(`${url}`);
  }

  getSessionsByFicha(courseId: number) {
    return this.http.get<SessionModel[]>(`/api/ficha/${courseId}/sessions`);
  }

  // metodo para aceptar filtros e inclusiones
  getAll(filters?: { [key: string]: string }, included?: string | string[]): Observable<SessionModel[]> {
    let params = new HttpParams();

    // si se especifican relaciones incluir, se añaden
    if (included) {
      const includeStr = Array.isArray(included) ? included.join(',') : included;
      params = params.set('included', includeStr);
    }

    // si se especifican filtros, se añaden a los parametros
    if (filters) {
      Object.keys(filters).forEach(key => {
        params = params.set(`filter[${key}]`, filters[key]);
      });
    }

    return this.http.get<SessionModel[]>(this.url, { params });
  }

  createSession(data: CreateSessionDTO): Observable<SessionModel[]> {
    return this.http.post<SessionModel[]>(this.url, data);
  }

  deleteSession(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }

  update(data: UpdateCourseDto): Observable<SessionModel> {
    const { id } = data;
    return this.http.put<SessionModel>(`${this.url}/${id}`, data);
  }

}
