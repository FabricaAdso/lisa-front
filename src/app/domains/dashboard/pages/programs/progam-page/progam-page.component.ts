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
@Component({
  selector: 'app-progam-page',
  standalone: true,
  imports: [CommonModule,NzInputModule,NgIconComponent,NzIconModule,NzTableModule,NzDividerModule,NzButtonModule, NzFlexModule, NzPopconfirmModule ],
  templateUrl: './progam-page.component.html',
  styleUrl: './progam-page.component.css',
  viewProviders:[provideIcons({ionSearch})]
})
export class ProgamPageComponent implements OnInit{
  ngOnInit(): void {
  }



  deleteRow(id: number): void {
    this.listOfData = this.listOfData.filter(d => d.idprogram !== id);
  }
  listOfData: Person[] = [
    {
      key: '1',
      idprogram: 1,
      programName: 'Analisis y desarrollo de sofwware',
      trainingLevel: 'Tecnologo'
    },
    {
      key: '2',
      idprogram: 2,
      programName: 'Gestión de talento humano',
      trainingLevel: 'Tecnologo'
    },
    {
      key: '3',
      idprogram: 3,
      programName: 'Animación 3D',
      trainingLevel: 'Tecnologo'
    },
    {
      key: '1',
      idprogram: 4,
      programName: 'Analisis y desarrollo de sofwware',
      trainingLevel: 'Tecnologo'
    },
    {
      key: '2',
      idprogram: 5,
      programName: 'Gestión de talento humano',
      trainingLevel: 'Tecnologo'
    },
    {
      key: '3',
      idprogram: 6,
      programName: 'Animación 3D',
      trainingLevel: 'Tecnologo'
    },
    {
      key: '1',
      idprogram: 6,
      programName: 'Analisis y desarrollo de sofwware',
      trainingLevel: 'Tecnologo'
    },
    {
      key: '2',
      idprogram: 7,
      programName: 'Gestión de talento humano',
      trainingLevel: 'Tecnologo'
    },
    {
      key: '3',
      idprogram: 8,
      programName: 'Animación 3D',
      trainingLevel: 'Tecnologo'
    },
    {
      key: '1',
      idprogram: 9,
      programName: 'Analisis y desarrollo de sofwware',
      trainingLevel: 'Tecnologo'
    },
    {
      key: '2',
      idprogram: 10,
      programName: 'Gestión de talento humano',
      trainingLevel: 'Tecnologo'
    },
    {
      key: '3',
      idprogram: 11,
      programName: 'Animación 3D',
      trainingLevel: 'Tecnologo'
    }
  ];

  
}

interface Person {
  key: string;
  idprogram: number;
  programName: string;
  trainingLevel: string;
}
