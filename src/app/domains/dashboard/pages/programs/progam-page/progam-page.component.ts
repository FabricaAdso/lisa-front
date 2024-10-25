import { Component, inject, OnInit } from '@angular/core';
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
import { ProgramModel } from '@shared/models/program.model';
import { ProgramService } from '@shared/services/program/program.service';
import { log } from 'ng-zorro-antd/core/logger';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
@Component({
  selector: 'app-progam-page',
  standalone: true,
  imports: [CommonModule,NzInputModule,NgIconComponent,NzIconModule,NzTableModule,NzDividerModule,NzButtonModule, NzFlexModule, NzPopconfirmModule,NzUploadModule, AddProgramModalComponent, BulkUploadModalComponent,NzSpaceModule,NzPaginationModule ],
  templateUrl: './progam-page.component.html',
  styleUrl: './progam-page.component.css',
  viewProviders:[provideIcons({ionSearch})]
})
export class ProgamPageComponent implements OnInit{

  program: ProgramModel[] = [];
  


  private programService = inject(ProgramService);
  ngOnInit(): void {
    this.obtenerProgramas()
  }

  obtenerProgramas(){
    this.programService.getAll().subscribe({
      next:(programas)=>{
        this.program=programas
      }
    })
    
  }
  crearPrograma(item:ProgramModel){
    this.program = [...this.program, item]
  }
  
  indexProgram: number | null = null;


  deleteRow(id: number): void {
    this.program = this.program.filter(d => d.id !== id);
  }

  delectProgram(id:number){
    const deleteSub = this.programService.delete(id).subscribe({
      next:(value)=> {
        let programs = [...this.program];
        let program_index = programs.findIndex((progam)=>progam.id===id);
        programs.splice(program_index, 1);
        this.program = programs;
      },
      complete:() => {
        deleteSub.unsubscribe();
      }
    })
  }

  
  
}

