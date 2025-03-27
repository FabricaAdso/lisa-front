import { Component, inject, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserModel } from '@shared/models/user.model';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { RolesModel } from '@shared/models/roles-model';
import { ApiRolesService } from '@shared/services/api-roles.service';


@Component({
  selector: 'app-edit-roles-modal',
  standalone: true,
  imports: [
    NzModalModule,
    NzButtonModule
  ],
  templateUrl: './edit-roles-modal.component.html',
  styleUrl: './edit-roles-modal.component.css'
})
export class EditRolesModalComponent  {

  @Input() userData?: UserModel | null;
  
  //Declaracion de varibales 
  isVisible = false;
  formUser!: FormGroup;
  roles: RolesModel []=[];


  //injeccion de servcios
  private rolesService = inject(ApiRolesService);

  ngOnInit(){
    this.getroles();

  }

  formData(){
    this.formUser = new FormGroup({
      role_id: new FormControl(this.userData?.name, [Validators.required]),
      
    })
  }
  getroles(){
    this.rolesService.getRoles().subscribe({
      next: (data) => {
        this.roles = data;
      }
    })
  }

  


  //Metodo para cerrar el modal
  closeModal(){
    this.isVisible = false
  }

  setData(data:UserModel):void{
    this.userData = data;

    this.formUser.patchValue({

    })


  }

  //Metodo para abrir el modal
  openModal(){
    this.isVisible = true
  }
  handleOk(): void {
    console.log('Button ok clicked!');
    this.isVisible = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }



}


