import { Component, inject, OnInit } from '@angular/core';
import { PasswordResetService } from '@shared/services/password-reset.service';

@Component({
  selector: 'app-password-reset',
  standalone: true,
  imports: [],
  templateUrl: './password-reset.component.html',
  styleUrl: './password-reset.component.css'
})
export class PasswordResetComponent implements OnInit{

  private token_password_service = inject(PasswordResetService)

  ngOnInit(): void {

  }
}
