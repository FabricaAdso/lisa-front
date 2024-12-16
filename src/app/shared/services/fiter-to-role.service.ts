import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class FiterToRoleService {

  constructor() { }
  private auth_Service = inject(AuthService);


  filterItems(rol: string): boolean {
    return 'Instructor' == rol;
    return !!this.auth_Service.user()?.training_centers?.some((center) =>
      center.pivot?.role?.some((rolItem) => rolItem.name === rol)
    );
  }
} 