import { Directive, inject } from '@angular/core';
import { AuthService } from '@shared/services/auth.service';

@Directive({
  selector: '[appPermission]',
  standalone: true
})
export class PermissionDirective {

  Role : string = "";
  constructor() { }
  private auth_Service = inject(AuthService);

  
}
