import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NzCardModule } from 'ng-zorro-antd/card';

@Component({
  selector: 'app-error-500',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NzCardModule
  ],
  templateUrl: './error-500.component.html',
  styleUrl: './error-500.component.css'
})
export class Error500Component {

  image_error: string = 'assets/images/error_500.svg'

}
