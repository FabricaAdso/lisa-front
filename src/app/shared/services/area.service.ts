import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AreaModel } from '../models/area-model';
import { CreateAreaDTO } from '../dto/create-areaDTO';
import { UpdateAreaDto } from '../dto/update-areaDTO';
import { QueryUrl } from '@shared/models/query-url.model';
import { getQueryUrl } from '@shared/functions/url.functions';

@Injectable({
  providedIn: 'root'
})
export class AreaService {

private http = inject(HttpClient);
url:string = 'environmentsArea';
constructor() { }

get(data?:QueryUrl){
  let url:string = getQueryUrl(this.url,data)
  console.log(url);

  return this.http.get<AreaModel[]>(url);
}
create(data:CreateAreaDTO){
  return this.http.post<AreaModel>(this.url,data);

}
update(data: UpdateAreaDto){
  const{id} = data;
 return this.http.put<AreaModel>(`${this.url}/${id}`,data);

}
delete(id:number){
  return this.http.delete(`${this.url}/${id}`);

}


}
