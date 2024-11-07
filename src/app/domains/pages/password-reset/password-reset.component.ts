import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule, Routes } from '@angular/router';
import { routes } from '@domains/auth/auth.routes';
import { PasswordResetService } from '@shared/services/password-reset.service';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-password-reset',
  standalone: true,
  imports: [],
  templateUrl: './password-reset.component.html',
  styleUrl: './password-reset.component.css'
})
export class PasswordResetComponent{


}
