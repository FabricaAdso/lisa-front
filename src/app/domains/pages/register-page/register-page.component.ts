import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { AuthLayoutComponent } from '@domains/auth/auth-layout/auth-layout.component';
import { NzFormModule } from 'ng-zorro-antd/form';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [AuthLayoutComponent, RouterOutlet, NzFormModule, CommonModule, FormsModule,ReactiveFormsModule],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css'
})
export class RegisterPageComponent {
  
  constructor(private router: Router){}

  formRegister = new FormGroup({
    document: new  FormControl('', [Validators.required]),
    option:  new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
    last_name: new FormControl('',[Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
  })


  get fieldDocument(){
    return this.formRegister.get('document') as FormControl;
  }
  get fieldOption(){
    return this.formRegister.get('option') as FormControl;
  }
  get fielName(){
    return this.formRegister.get('name') as FormControl;
  }
  get fieldLastName(){
    return this.formRegister.get('last_name') as FormControl;
  }
  get fieldEmail(){
    return this.formRegister.get('email') as FormControl;
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

}
