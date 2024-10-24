import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  AbstractControl,
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
export class AddProgramFormComponent {

  @Input() isVisible:boolean = false;

  @Output() onCancel = new EventEmitter<void>();

  simpleForm: FormGroup<{
    programa: FormControl<string>;
    tipo: FormControl<string>;
  }>;

  constructor(private fb: NonNullableFormBuilder) {
    this.simpleForm = this.fb.group({
      programa: ['', [Validators.required]],
      tipo: ['', [Validators.required]],
    });
  }

  submitForm(): void {
    console.log('Formulario enviado', this.simpleForm.value);
  }

  resetForm(e: MouseEvent): void {
    e.preventDefault();
    this.onCancel.emit();
    this.simpleForm.reset();
  }

}
