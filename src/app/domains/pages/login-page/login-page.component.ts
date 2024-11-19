import { Component, ElementRef, inject, OnDestroy, signal, ViewChild } from '@angular/core';
import { AuthLayoutComponent } from "../../auth/auth-layout/auth-layout.component";
import { Router, RouterOutlet } from '@angular/router';
import { NzFormModule } from 'ng-zorro-antd/form';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginDTO } from '@shared/dto/login.dto';
import { forkJoin, Subscription } from 'rxjs';
import { AuthService } from '@shared/services/auth.service';
import { TokenService } from '@shared/services/token.service';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { UserService } from '@shared/services/user.service';
import { PasswordEmailService } from '@shared/services/password-email.service';
import { PasswordEmailModel } from '@shared/models/password-email.model';
import { PasswordEmailDTO } from '@shared/dto/password-email.dto';


@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [AuthLayoutComponent, RouterOutlet, NzFormModule, CommonModule, FormsModule, ReactiveFormsModule, NzInputModule, NzIconModule, NzButtonModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent implements OnDestroy {
  

  @ViewChild('buttonView')buttonView: ElementRef = {} as ElementRef;

  private auth_service = inject(AuthService);
  private token_service = inject(TokenService);
  private router = inject(Router);

  passwordVisible: boolean = true
  showModalLogin: boolean = false;
  errorMessageLogin: string | null = null;
  private password_email_service = inject(PasswordEmailService);

  showModal: boolean = false;
  errorMessage: string | null = null;
  user:any [] = [];


  login_sub:Subscription | null = null;
  isLoadingOne = false;
  isLoadingTwo = false;


  button_value = signal(false);

  ngOnDestroy(): void {
    if(this.login_sub){
      this.login_sub.unsubscribe();
    }
}

  goRegister() {
    this.router.navigate(['/auth/register']);
  }

  formLogin = new FormGroup({
    identity_document: new FormControl('', [Validators.required]),
    password: new  FormControl('', [Validators.required]),
  });

  formEmail = new FormGroup({
    email: new FormControl('', [Validators.required]),
  })


  get fieldDocument(){
    return this.formLogin.get('identity_document') as FormControl;
  }

  get fieldPassword(){
    return this.formLogin.get('password') as FormControl;
  }

  get fieldEmail(){
    return this.formEmail.get('email') as FormControl;
  }


  onSubmit() {
    if (!this.formLogin.valid) {
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
        this.router.navigate(['/dashboard']);
      },
      error: error =>{
        console.log(error);

        this.router.navigate(['auth/login'])
        if(this.formLogin.get('identity_document')!.value! == '' || this.formLogin.get('password')!.value! == ''){
          
        }else{
          this.errorMessageLogin = 'Contraseña o numero de documento incorrectos'
          this.showModalLogin = true;
      }
    }

    })

  }

  closeModalLogin() {
    this.showModalLogin = false; // Ocultar el modal
    this.errorMessageLogin = null; // Reiniciar el mensaje
    this.showModal = false; // Ocultar el modal
    this.errorMessage = null; // Reiniciar el mensaje
  }

  password(){
    this.showModal = true
  }

  loadOne(): void {
    this.isLoadingOne = true;
    setTimeout(() => {
      this.isLoadingOne = false;
      alert('correo enviado')
      this.sendEmail()
    }, 5000);
  }

  sendEmail(){
    let emailData:PasswordEmailDTO = {
      email: this.formLogin.get('email')!.value!
    }

    this.password_email_service.postEmail(emailData).subscribe({
      next: (response) => {
        console.log(response);
      }
    })
  }

  // loadTwo(): void {
  //   this.isLoadingTwo = true;
  //   setTimeout(() => {
  //     this.isLoadingTwo = false;
  //   }, 5000);
  // }

}

