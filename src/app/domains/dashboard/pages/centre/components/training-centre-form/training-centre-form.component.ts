import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, input, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TrainingCentreModel } from '@shared/models/training-centre-model';
import { TrainingCentreService } from '@shared/services/training-centre.service';
import { noWhiteSpaceValidator } from '@shared/validators/no-wite-space.validator';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { Subscription } from 'rxjs';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-training-centre-form',
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
  templateUrl: './training-centre-form.component.html',
  styleUrl: './training-centre-form.component.css'
})
export class TrainingCentreFormComponent {

  private formBuilder = inject(FormBuilder);
  private centreService = inject(TrainingCentreService);

  @Input()centre?: TrainingCentreModel | undefined;
  @Input() isVisible:boolean | undefined ;

  @Output() update = new EventEmitter<TrainingCentreModel>();
  @Output() create = new EventEmitter<TrainingCentreModel>();
  @Output() closeModal = new EventEmitter<boolean>();

  form:FormGroup;
  saveSub:Subscription|null = null;
  dataSub:Subscription|null = null;


  constructor(
    private notification: NzNotificationService
  ){
    this.form = this.formBuilder.group({
      name:new FormControl(null,[Validators.required,noWhiteSpaceValidator()])
    },);
  }

  ngOnInit(): void {
    if(this.centre){
      this.form.addControl('id',new FormControl(this.centre.id));
      this.form.get('name')!.setValue(this.centre.name);
    }
  }
  ngOnDestroy(): void {
    if(this.saveSub) this.saveSub.unsubscribe();
  }

  editCentre(){
    if(this.form.invalid) return; 
    const {value} = this.form;
    this.saveSub = this.centreService.update(value)
      .subscribe({
        next:(new_centre)=>{
          this.update.emit(new_centre);
        }
      });
  }

  createCentre(){
    if(this.form.invalid) return; 
    const {value} = this.form;
    this.saveSub = this.centreService.create(value)
      .subscribe({
        next:(new_area)=>{
          this.create.emit(new_area);
          this.notificacion("Se creo el centro "+new_area.name+" correctamente","Centro")
        }
      });
  }

  notificacion(Mensaje:string,titulo:string){
    this.notification.blank(titulo, Mensaje);
  }


  saveData(){
    if (this.centre) {
      this.editCentre();
      return;
    }
    this.createCentre();
  }

}
