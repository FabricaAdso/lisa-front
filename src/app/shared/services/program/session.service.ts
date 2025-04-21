import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CreateSessionDTO } from '@shared/dto/create-session.dto';
import { UpdateCourseDto } from '@shared/dto/program/update-course-dto';
import { DeleteRangeParams, sessionupdatepartialDto, UpdateSessionDto } from '@shared/dto/program/update-session-dto';
import { getQueryUrl } from '@shared/functions/url.functions';
import { PaginateModel } from '@shared/models/paginate.model';
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

  updateSession(data: any): Observable<SessionModel> {
    const { id } = data;
    return this.http.put<SessionModel>(`session/update/${id}`, data);
  }



  deleteSession(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }

  update(data: UpdateCourseDto): Observable<SessionModel> {
    const { id } = data;
    return this.http.put<SessionModel>(`${this.url}/${id}`, data);
  }

 // Método para obtener sesiones con paginación (getAlltwo)
  getAlltwo(filters?: { [key: string]: string }, included?: string | string[]): Observable<PaginateModel<SessionModel>> {
    let params = new HttpParams();
    if (included) {
      const includeStr = Array.isArray(included) ? included.join(',') : included;
      params = params.set('included', includeStr);
      console.log('Included:', includeStr);
    }
    if (filters) {
      Object.keys(filters).forEach(key => {
        params = params.set(`filter[${key}]`, filters[key]);
        console.log('Setting filter:', key, filters[key]);
      });
      console.log('Request URL:', this.url);
    }
    return this.http.get<PaginateModel<SessionModel>>(this.url, { params });
  }

  getLeaderSessions(filters?: { [key: string]: string }, included?: string | string[]): Observable<PaginateModel<SessionModel>> {
    let params = new HttpParams();

    if (included) {
      const includeStr = Array.isArray(included) ? included.join(',') : included;
      params = params.set('included', includeStr);
    }
    if (filters) {
      Object.keys(filters).forEach(key => {
        params = params.set(`filter[${key}]`, filters[key]);
      });
    }

    // Suponiendo que la URL base es 'session' y el endpoint para líder es 'session/leader'
    return this.http.get<PaginateModel<SessionModel>>(`${this.url}/leader`, { params });
  }

  getFilterOptions(): Observable<any> {
    // Suponiendo que la URL para obtener las opciones es 'session/leadersession'
    return this.http.get<any>(`${this.url}/leadersession`);
  }

  getSessionByMount(data?: QueryUrl): Observable<any> {
    const url: string = getQueryUrl(`sessions/mount`, data);
    return this.http.get<any>(url);
  }

  getFilterOptionsWithCourse(filters: { [key: string]: string }): Observable<any> {
    let params = new HttpParams();
    Object.keys(filters).forEach(key => {
      params = params.set(`filter[${key}]`, filters[key]);
    });
    return this.http.get<any>(`${this.url}/leadersession`, { params });
  }


  deleteSessionsByDateRange(params: DeleteRangeParams): Observable<any> {
    return this.http.delete('sessions/delete-by-date', {
      body: params
    });
  }
}
