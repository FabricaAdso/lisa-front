import { Component, ElementRef, inject, OnDestroy, signal, ViewChild } from '@angular/core';
import { AuthLayoutComponent } from "../../auth/auth-layout/auth-layout.component";
import { Router, RouterOutlet } from '@angular/router';
import { NzFormModule } from 'ng-zorro-antd/form';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginDTO } from '@shared/dto/login.dto';
import { Subscription } from 'rxjs';
import { AuthService } from '@shared/services/auth.service';
import { TokenService } from '@shared/services/token.service';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [AuthLayoutComponent, RouterOutlet, NzFormModule, CommonModule, FormsModule, ReactiveFormsModule, NzInputModule, NzIconModule, NzButtonModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent implements OnDestroy {
  constructor(private router: Router) { }

  @ViewChild('buttonView')buttonView: ElementRef = {} as ElementRef;

  private auth_service = inject(AuthService);
  private token_service = inject(TokenService);

  passwordVisible: boolean = true
  showModal: boolean = false;
  errorMessage: string | null = null;

  login_sub:Subscription | null = null;
  isLoadingOne = false;
  isLoadingTwo = false;


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
        this.router.navigate(['/dashboard']);
      },
      error: error =>{
        console.log(error);

        this.router.navigate(['auth/login'])
        this.errorMessage = 'Documento o contraseña incorrectos';
        this.showModal = true;
      }
    })

  }

  closeModal() {
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
    }, 5000);
  }

  loadTwo(): void {
    this.isLoadingTwo = true;
    setTimeout(() => {
      this.isLoadingTwo = false;
    }, 5000);
  }

}

