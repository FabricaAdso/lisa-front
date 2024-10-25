import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzFormModule, NzFormTooltipIcon } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzSelectComponent, NzSelectModule } from 'ng-zorro-antd/select';

@Component({
  selector: 'app-add-program-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzButtonModule, 
    NzFormModule, 
    NzInputModule, 
    NzIconModule, 
    NzPopconfirmModule, 
    NzFlexModule, 
    NzSelectModule,
    NzModalModule
  ],
  templateUrl: './add-program-form.component.html',
  styleUrl: './add-program-form.component.css'
})
export class AddProgramFormComponent implements OnInit{

  private  FormBuilder = inject(FormBuilder);

  @Input() isVisible:boolean = false;

  @Output() onCancel = new EventEmitter<void>();

  programform: FormGroup<{
    program: FormControl<string>;
    education_level: FormControl<string>;
  }>;

  constructor(private fb: NonNullableFormBuilder) {

    

    this.programform = this.fb.group({
      program: ['', [Validators.required]],
      education_level: ['', [Validators.required]],
    });
  }
  ngOnInit(): void {
    
  }

  submitForm(): void {
    console.log('Formulario enviado', this.programform.value);
  }

  resetForm(e: MouseEvent): void {
    e.preventDefault();
    this.onCancel.emit();
    this.programform.reset();
  }

}
