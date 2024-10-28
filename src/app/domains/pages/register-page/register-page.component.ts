import { CommonModule } from '@angular/common';
import { Component, Inject, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { AuthLayoutComponent } from '@domains/auth/auth-layout/auth-layout.component';
import { CreateUserDTO } from '@shared/dto/create-user.dto';
import { DocumentTypeModel } from '@shared/models/document-type.model';
import { UserModel } from '@shared/models/user.model';
import { DocumentTypeService } from '@shared/services/document-type.service';
import { UserService } from '@shared/services/user.service';
import { log } from 'ng-zorro-antd/core/logger';
import { NzFormModule } from 'ng-zorro-antd/form';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [AuthLayoutComponent, RouterOutlet, NzFormModule, CommonModule, FormsModule,ReactiveFormsModule],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css'
})
export class RegisterPageComponent implements OnInit {
  
  constructor(private router: Router){}

  private formBuilder = Inject(FormBuilder);

  private document_type_service = inject(DocumentTypeService);
  private user_service = inject(UserService)
  
  document_type: DocumentTypeModel[] = [];
  user:UserModel[] = []
  


  ngOnInit(): void {
    this.getData();
  }

  getData(){
    const data_sub = forkJoin([
      this.document_type_service.getAll()
    ]).subscribe({
      next: ([document_type]) => {
        this.document_type = [...document_type];
      },
      complete(){
        data_sub.unsubscribe()
      }
    })
  }

  alert(){
    alert('Usuario creado correctamente')
  }

  go(){
    this.router.navigate(['auth/login']);
  }

  onSubmit(){
    if(this.formRegister.valid){
      console.log(this.formRegister.value);
      
    const register: CreateUserDTO  = this.formRegister.value as CreateUserDTO;

    this.user_service.create(register).subscribe({
      next: (data) => {
        let user = [...this.user,data]
      }
    })
    }else{
      this.formRegister.markAllAsTouched()
    }
  }

  valuePassword(){
    setTimeout(() => {
      let password =  this.formRegister.get('password')!.value;
      let confirmPassword =  this.formRegister.get('password_confirmation')!.value;
     if(password === confirmPassword){
      const password_true = true;
     }else{
      const password_false = false;
     }
    }, 100);
  }

  formRegister = new FormGroup({
    identity_document: new  FormControl('', [Validators.required]),
    document_type_id:  new FormControl('', [Validators.required]),
    first_name: new FormControl('', [Validators.required]),
    last_name: new FormControl('',[Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    password_confirmation:  new FormControl('', [Validators.required, Validators.minLength(8)]),
  })


  registrarse(){
    this.formRegister = this.formBuilder.group()
  }
}
