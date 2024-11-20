import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
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
  errorMessage: string = '';
  image_error: string = 'assets/images/error_500.svg'
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.errorMessage = params['message'] || 'Error desconocido';
    });
  }
}
