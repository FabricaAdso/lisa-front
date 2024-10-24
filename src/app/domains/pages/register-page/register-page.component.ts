import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { AuthLayoutComponent } from '@domains/auth/auth-layout/auth-layout.component';
import { DocumentTypeModel } from '@shared/models/document-type.model';
import { DocumentTypeService } from '@shared/services/document-type.service';
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

  private document_type_service = inject(DocumentTypeService);
  document_type: DocumentTypeModel[] = [];

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
    console.log(this.document_type)
  }

  formRegister = new FormGroup({
    identity_document: new  FormControl('', [Validators.required]),
    option:  new FormControl('', [Validators.required]),
    first_name: new FormControl('', [Validators.required]),
    last_name: new FormControl('',[Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    confirmation_password:  new FormControl('', [Validators.required, Validators.minLength(8)]),
  })


  get fieldDocument(){
    return this.formRegister.get('identity_document') as FormControl;
  }
  get fieldOption(){
    return this.formRegister.get('option') as FormControl;
  }
  get fieldName(){
    return this.formRegister.get('first_name') as FormControl;
  }
  get fieldLastName(){
    return this.formRegister.get('last_name') as FormControl;
  }
  get fieldEmail(){
    return this.formRegister.get('email') as FormControl;
  }
  get fieldPassword(){
    return this.formRegister.get('password') as FormControl;
  }
  get fielPasswordConfirmation(){
    return  this.formRegister.get('confirmation_password') as FormControl;
  }

  alert(){
    alert('Usuario creado correctamente')
  }

  go(){
    this.router.navigate(['auth/login']);
  }

  onSubmit(){
    if(this.formRegister.valid){
      console.log(this.formRegister);
      alert('Usuario creado correctamente')
      this.go()
    }else{
      this.formRegister.markAllAsTouched()
    }
  }

  valuePassword(){
    setTimeout(() => {
      let password =  this.fieldPassword.value;
      let confirmPassword =  this.fielPasswordConfirmation.value;
     if(password === confirmPassword){
      console.log('valido')
     }else{
      console.log('invalido')
     }
    }, 100);
  }
}
