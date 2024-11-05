import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NzCardModule } from 'ng-zorro-antd/card';

@Component({
  selector: 'app-error-403',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NzCardModule
  ],
  templateUrl: './error-403.component.html',
  styleUrl: './error-403.component.css'
})
export class Error403Component {

  image_error: string = 'assets/images/error_403.svg'

}
