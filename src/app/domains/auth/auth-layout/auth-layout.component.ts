import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginPageComponent } from "../../pages/login-page/login-page.component";
import { Router, RouterOutlet } from '@angular/router';
import { RegisterPageComponent } from '../../pages/register-page/register-page.component';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterOutlet,FormsModule, CommonModule, ReactiveFormsModule, LoginPageComponent,RegisterPageComponent],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.css'
})
export class AuthLayoutComponent {
  @ViewChild('form')form: ElementRef = {} as ElementRef;

    email:string  = '';
    password:string =  '';

    addFocus(){
      let formulario = this.form.nativeElement
      let contenedores = this.form.nativeElement.querySelectorAll('.container-input');
      
      contenedores.forEach((element:any) => {
  
        if(element.classList.contains('focus')){
          element.classList.remove('focus')
        }else{
          element.classList.add('focus')
        }
        console.log(element)
  
    })
  }
  constructor(private router: Router) {}

  go(){
    
  }

  
  
}
