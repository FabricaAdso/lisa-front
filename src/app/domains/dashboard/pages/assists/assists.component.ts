import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzFormLabelComponent, NzFormModule } from 'ng-zorro-antd/form';
import { NzMessageService } from 'ng-zorro-antd/message';
import {  NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzOptionComponent, NzSelectComponent } from 'ng-zorro-antd/select';
import { NzTableComponent } from 'ng-zorro-antd/table';
import { NzTabComponent, NzTabSetComponent } from 'ng-zorro-antd/tabs';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NzUploadModule } from 'ng-zorro-antd/upload';

interface Persona {
  id: number;
  documento: string;
  nombreCompleto: string;
  fechaInicio?: Date;
  fechaFin?: Date;
}
@Component({
  selector: 'app-assists',
  standalone: true,
  imports: [
    CommonModule,
    NzTableComponent,
    NzTabSetComponent,
    NzTabComponent,
    NzModalModule,
    NzAlertModule,
    NzFormLabelComponent,
    NzFormModule,
    NzFormModule,
    NzSelectComponent,
    NzOptionComponent,
    FormsModule,
    ReactiveFormsModule,
    NzUploadModule

  ],

  providers: [NzModalService, NzMessageService],
  templateUrl: './assists.component.html',
  styleUrl: './assists.component.css'
})
export class AssistsComponent implements OnInit {
  fileList: NzUploadFile[] = [
    {
      uid: '1',
      name: 'xxx.png',
      status: 'done',
      response: 'Server Error 500', // custom error message to show
      url: 'http://www.baidu.com/xxx.png'
    },
    {
      uid: '2',
      name: 'yyy.png',
      status: 'done',
      url: 'http://www.baidu.com/yyy.png'
    },
    {
      uid: '3',
      name: 'zzz.png',
      status: 'error',
      response: 'Server Error 500', // custom error message to show
      url: 'http://www.baidu.com/zzz.png'
    }
  ];
  listaPersonas: Persona[] = [
    { id: 1, documento: '123456789', nombreCompleto: 'Juan Perez' },
    { id: 2, documento: '987654321', nombreCompleto: 'Maria Garcia' },
  ];
  instructores: Persona[] = [];
  aprendices: Persona[] = [];
  isUploadModalVisible = false;
  isModalVisible = false;
  modalType: 'instructor' | 'aprendiz' |'archivos'| null = null;
  form: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private cdr: ChangeDetectorRef

  )
   {
    this.form = this.fb.group({
      persona: [null, Validators.required],
    });
  }


  ngOnInit(): void { }

  openModal(type: 'instructor' | 'aprendiz' ): void {
    this.modalType = type;
    this.isModalVisible = true;
    this.errorMessage = null; // Limpiar cualquier mensaje de error previo
  }
  openUploadModal(): void {
    this.isUploadModalVisible = true;
  }
  handleOk(): void {
    if (this.form.valid) {
      const selectedPersona = this.listaPersonas.find
        (p => p.id === this.form.value.persona
      );

      if (selectedPersona) {
        const personaConFecha = {
          ...selectedPersona,
          fechaInicio: new Date(),
          fechaFin: new Date(new Date().setMonth(new Date().getMonth() + 6))
        };
        if (this.modalType === 'instructor') {
          this.instructores = [...this.instructores, personaConFecha];
        } else if (this.modalType === 'aprendiz') {
          this.aprendices = [...this.aprendices, personaConFecha];
        }

        this.isModalVisible = false;
        this.errorMessage = null;
        this.message.success(`${this.modalType} asignado exitosamente.`);
        this.form.reset(); // Limpiar el formulario para la próxima vez
        this.cdr.detectChanges(); // Forzar la detección de cambios
      } else {
        this.errorMessage = 'Persona no encontrada en la lista.';
      }
    } else {
      this.errorMessage = 'Por favor selecciona una persona.';
    }
  }
  handleUploadOk(): void {
    this.isUploadModalVisible = false;
    this.message.success('Archivo(s) subido(s) exitosamente.');
  }
  handleUploadCancel(): void {
    this.isUploadModalVisible = false;
  }


  handleCancel(): void {
    this.isModalVisible = false;
    this.errorMessage = null; // Limpiar cualquier mensaje de error previo
    this.form.reset(); // Limpiar el formulario para la próxima vez
  }
}
