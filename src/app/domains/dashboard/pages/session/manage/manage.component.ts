import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-manage',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './manage.component.html',
  styleUrl: './manage.component.css'
})
export class ManageComponent {

}
