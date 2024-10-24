import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzInputModule } from 'ng-zorro-antd/input';
import {NgIconComponent, provideIcons} from '@ng-icons/core';
import {ionSearch} from '@ng-icons/ionicons'
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFlexModule } from 'ng-zorro-antd/flex'
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzAlign, NzJustify } from 'ng-zorro-antd/flex';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { AddProgramModalComponent } from '../modals/add-program-modal/add-program-modal.component';
import { BulkUploadModalComponent } from '../modals/bulk-upload-modal/bulk-upload-modal.component';
import { NzSpaceModule } from 'ng-zorro-antd/space';
@Component({
  selector: 'app-progam-page',
  standalone: true,
  imports: [CommonModule,NzInputModule,NgIconComponent,NzIconModule,NzTableModule,NzDividerModule,NzButtonModule, NzFlexModule, NzPopconfirmModule,NzUploadModule, AddProgramModalComponent, BulkUploadModalComponent,NzSpaceModule ],
  templateUrl: './progam-page.component.html',
  styleUrl: './progam-page.component.css',
  viewProviders:[provideIcons({ionSearch})]
})
export class ProgamPageComponent implements OnInit{
  ngOnInit(): void {
  }



  deleteRow(id: number): void {
    this.listOfData = this.listOfData.filter(d => d.id !== id);
  }
  listOfData: Person[] = [
    {
      key: '1',
      id: 1,
      name: 'Analisis y desarrollo de sofwware',
      education_level_id: 'Tecnologo'
    },
    {
      key: '2',
      id: 2,
      name: 'Gestión de talento humano',
      education_level_id: 'Tecnologo'
    },
    {
      key: '3',
      id: 3,
      name: 'Animación 3D',
      education_level_id: 'Tecnologo'
    },
    {
      key: '1',
      id: 4,
      name: 'Analisis y desarrollo de sofwware',
      education_level_id: 'Tecnologo'
    },
    {
      key: '2',
      id: 5,
      name: 'Gestión de talento humano',
      education_level_id: 'Tecnologo'
    },
    {
      key: '3',
      id: 6,
      name: 'Animación 3D',
      education_level_id: 'Tecnologo'
    },
    {
      key: '1',
      id: 6,
      name: 'Analisis y desarrollo de sofwware',
      education_level_id: 'Tecnologo'
    },
    {
      key: '2',
      id: 7,
      name: 'Gestión de talento humano',
      education_level_id: 'Tecnologo'
    },
    {
      key: '3',
      id: 8,
      name: 'Animación 3D',
      education_level_id: 'Tecnologo'
    },
    {
      key: '1',
      id: 9,
      name: 'Analisis y desarrollo de sofwware',
      education_level_id: 'Tecnologo'
    },
    {
      key: '2',
      id: 10,
      name: 'Gestión de talento humano',
      education_level_id: 'Tecnologo'
    },
    {
      key: '3',
      id: 11,
      name: 'Animación 3D',
      education_level_id: 'Tecnologo'
    }
  ];

  

  
  
}

interface Person {
  key: string;
  id: number;
  name: string;
  education_level_id: string;
}
