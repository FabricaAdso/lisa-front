import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NzCardModule } from 'ng-zorro-antd/card';

@Component({
  selector: 'app-error-504',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NzCardModule
  ],
  templateUrl: './error-504.component.html',
  styleUrl: './error-504.component.css'
})
export class Error504Component {

  image_error: string = 'assets/images/error_504.svg'

}
