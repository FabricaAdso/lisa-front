import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-bulkuploadbasic',
  standalone: true,
  imports: [CommonModule, HttpClient],
  templateUrl: './bulkuploadbasic.component.html',
  styleUrl: './bulkuploadbasic.component.css'
})
export class BulkuploadbasicComponent {

}
