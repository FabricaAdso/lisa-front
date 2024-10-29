import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { CreateAreaDTO } from '@shared/dto/create-areaDTO';
import { UpdateAreaDto } from '@shared/dto/update-areaDTO';
import { AreaModel } from '@shared/models/area-model';
import { AreaService } from '@shared/services/area.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { AreaFormComponent } from './components/area-form/area-form.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-area',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzModalModule,
    NzTableModule,
    NzButtonModule,
    NzFormModule,
    NzInputModule,
    NzPopconfirmModule,
    AreaFormComponent
  ],
  templateUrl: './area.component.html',
  styleUrl: './area.component.css'
})
export class AreaComponent implements OnInit,OnDestroy{


  private areaService = inject(AreaService);
  private nzMessageService = inject(NzMessageService);

  areas: AreaModel[] = [];
  area:AreaModel|undefined = undefined;
  isModalVisible = false;
  isModalEditVisible = false;

  deleteSub:Subscription|null = null;

  ngOnInit() {
    this.getAreas();
  }

  ngOnDestroy(): void {
    if(this.deleteSub) this.deleteSub.unsubscribe();
  }

  cancel(): void {
    this.nzMessageService.info('click cancel');
  }

  confirm(id: number): void {
    this.deleteArea(id); 
    this.nzMessageService.info('Confirmación de eliminación');
  }

  deleteArea(id: number) {
    this.deleteSub = this.areaService.delete(id).subscribe(() => {
      this.getAreas();
    });
  }

  getAreas(): void {
    this.areaService.get().subscribe({
      next: (data: AreaModel[]) => {
        this.areas = data;
      }
    });
  }

  openEdit(area:AreaModel){
   this.area = area;
   this.isModalVisible = true;
  }

  edit(area:AreaModel){
    const {id} = area;
    const index_area = this.areas.findIndex((area)=>area.id === id);
    if(!index_area) return;
    let areas = [...this.areas];
    areas[index_area] = area;
    this.areas = areas;
    this.closeModal();
  }

  create(area:AreaModel){
    this.areas = [...this.areas,area];
    this.isModalVisible = false;
  }

  openModal(): void {
    this.isModalVisible = true;
  }
  closeModal(): void {
    this.isModalVisible = false;
    this.area = undefined;
    this.isModalEditVisible = false;
  }

}
