import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AreaModel } from '@shared/models/area-model';
import { AreaService } from '@shared/services/area.service';
import { noWhiteSpaceValidator } from '@shared/validators/no-wite-space.validator';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-area-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzModalModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    ReactiveFormsModule,
    
  ],
  templateUrl: './area-form.component.html',
  styleUrl: './area-form.component.css'
})
export class AreaFormComponent implements OnInit, OnDestroy,OnChanges{

  private formBuilder = inject(FormBuilder);
  private areaService = inject(AreaService);

  @Input() area?:AreaModel;
  @Input() isVisible:boolean = false;

  @Output() update = new EventEmitter<AreaModel>();
  @Output() create = new EventEmitter<AreaModel>();
  @Output() cancel = new EventEmitter<void>();

  form:FormGroup;
  saveSub:Subscription|null = null;

  constructor(){
    this.form = this.formBuilder.group({
      name:new FormControl(null,[Validators.required,noWhiteSpaceValidator()])
    });
  }

  ngOnInit(): void {
    if(this.area){
      this.form.addControl('id',new FormControl(this.area.id));
      this.form.get('name')!.setValue(this.area.name);
    }
  }

  ngOnDestroy(): void {
    if(this.saveSub) this.saveSub.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    
  }

  saveData(){
    if (this.area) {
      this.editArea();
      return;
    }
    this.createArea();
  }

  editArea(){
    if(this.form.invalid) return; 
    const {value} = this.form;
    this.saveSub = this.areaService.update(value)
      .subscribe({
        next:(new_area)=>{
          this.update.emit(new_area);
        }
      });
  }

  createArea(){
    if(this.form.invalid) return; 
    const {value} = this.form;
    this.saveSub = this.areaService.create(value)
      .subscribe({
        next:(new_area)=>{
          this.create.emit(new_area);
        }
      });
  }

  cancelForm(){
    this.cancel.emit();
  }
}
