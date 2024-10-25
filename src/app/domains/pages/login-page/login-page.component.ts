import { Component, ElementRef, inject, OnDestroy, signal, ViewChild } from '@angular/core';
import { AuthLayoutComponent } from "../../auth/auth-layout/auth-layout.component";
import { Router, RouterOutlet } from '@angular/router';
import { NzFormModule } from 'ng-zorro-antd/form';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { log } from 'ng-zorro-antd/core/logger';
import { LoginDTO } from '@shared/dto/login.dto';
import { Subscription } from 'rxjs';
import { AuthService } from '@shared/services/auth.service';
import { TokenService } from '@shared/services/token.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [AuthLayoutComponent, RouterOutlet, NzFormModule, CommonModule, FormsModule,ReactiveFormsModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent implements OnDestroy {
  constructor(private router: Router) { }

  @ViewChild('buttonView')buttonView: ElementRef = {} as ElementRef;

  private auth_service = inject(AuthService);
  private token_service = inject(TokenService);

  login_sub:Subscription | null = null;

  button_value = signal(false);

  ngOnDestroy(): void {
    if(this.login_sub){
      this.login_sub.unsubscribe();
    }
}

  go() {
    this.router.navigate(['/auth/register']);
  }

  formLogin = new FormGroup({
    identity_document: new FormControl('', [Validators.required]),
    password: new  FormControl('', [Validators.required])
  });


  get fieldDocument(){
    return this.formLogin.get('identity_document') as FormControl;
  }

  get fieldPassword(){
    return this.formLogin.get('password') as FormControl;
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

  login(){
    let data:LoginDTO = {
      identity_document: this.formLogin.get('identity_document')!.value!,
      password: this.formLogin.get('password')!.value!
    }


    this.login_sub = this.auth_service.login(data)
    .subscribe({
      next: (token) => {
        this.token_service.setToken(token)
        this.router.navigate(['/auth/register']);
      },
      error: error =>{
        console.log(error);
        
        this.router.navigate(['auth/login'])
        alert('Error de autenticacion')       
      }
    })

  }




}
