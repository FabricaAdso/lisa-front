import { Component, ElementRef, signal, ViewChild } from '@angular/core';
import { AuthLayoutComponent } from "../../auth/auth-layout/auth-layout.component";
import { Router, RouterOutlet } from '@angular/router';
import { NzFormModule } from 'ng-zorro-antd/form';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { log } from 'ng-zorro-antd/core/logger';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [AuthLayoutComponent, RouterOutlet, NzFormModule, CommonModule, FormsModule,ReactiveFormsModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {
  constructor(private router: Router) { }

  @ViewChild('buttonView')buttonView: ElementRef = {} as ElementRef;

  document: string  = '';
  password: string  = '';

  button_value = signal(false);

  go() {
    this.router.navigate(['/auth/register']);
  }

  formLogin = new FormGroup({
    document: new FormControl('', [Validators.required]),
    password: new  FormControl('', [Validators.required])
  });


  get fieldDocument(){
    return this.formLogin.get('document') as FormControl;
  }

  get fieldPassword(){
    return this.formLogin.get('password') as FormControl;
  }

  login(){
    return console.log(this.formLogin);
  }

  onSubmit() {
    if (this.formLogin.valid) {
      console.log(this.formLogin)
    } else {
      this.formLogin.markAllAsTouched();    
    }
  }

  stateButton(){
    this.button_value.set(this.formLogin.valid);
  }


}
