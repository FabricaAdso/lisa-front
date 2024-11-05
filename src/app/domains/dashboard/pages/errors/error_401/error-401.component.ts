import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NzCardModule } from 'ng-zorro-antd/card';

@Component({
  selector: 'app-error-401',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NzCardModule
  ],
  templateUrl: './error-401.component.html',
  styleUrl: './error-401.component.css'
})
export class Error401Component {

  image_error: string = 'assets/images/error_401.svg'

}
