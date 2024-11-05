import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzFormLabelComponent, NzFormModule } from 'ng-zorro-antd/form';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalComponent, NzModalService } from 'ng-zorro-antd/modal';
import { NzOptionComponent, NzSelectComponent } from 'ng-zorro-antd/select';
import { NzTableComponent } from 'ng-zorro-antd/table';
import { NzTabComponent, NzTabSetComponent } from 'ng-zorro-antd/tabs';
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
  imports: [CommonModule, NzTableComponent, NzTabSetComponent, NzTabComponent,
    NzModalComponent, NzAlertModule, NzFormLabelComponent, NzFormModule, NzFormModule, NzSelectComponent,
    NzOptionComponent, FormsModule, ReactiveFormsModule

  ],
  providers: [NzModalService, NzMessageService],
  templateUrl: './assists.component.html',
  styleUrl: './assists.component.css'
})
export class AssistsComponent implements OnInit {
  listaPersonas: Persona[] = [
    { id: 1, documento: '123456789', nombreCompleto: 'Juan Perez' },
    { id: 2, documento: '987654321', nombreCompleto: 'Maria Garcia' },
  ];
  instructores: Persona[] = [];
  aprendices: Persona[] = [];
  isModalVisible = false;
  modalType: 'instructor' | 'aprendiz' | null = null;
  form: FormGroup;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private message: NzMessageService, private cdr: ChangeDetectorRef) {
    this.form = this.fb.group({
      persona: [null, Validators.required],
    });
  }

  ngOnInit(): void { }

  openModal(type: 'instructor' | 'aprendiz'): void {
    this.modalType = type;
    this.isModalVisible = true;
  }

  handleOk(): void {
    if (this.form.valid) {
      const selectedPersona = this.listaPersonas.find(
        (p) => p.id === this.form.value.persona
      );

      if (selectedPersona) {
        const personaConFecha = {
          ...selectedPersona,
          fechaInicio: new Date(),
          fechaFin: new Date(new Date().setMonth(new Date().getMonth() + 6))
        };

        if (this.modalType === 'instructor') {
          this.instructores = [...this.instructores, personaConFecha]; // Crear un nuevo arreglo para forzar la detección
        } else if (this.modalType === 'aprendiz') {
          this.aprendices = [...this.aprendices, personaConFecha]; // Crear un nuevo arreglo para forzar la detección
        }

        this.isModalVisible = false;
        this.errorMessage = null;
        this.message.success(`${this.modalType} asignado exitosamente.`);
        this.form.reset();
        this.cdr.detectChanges(); // Forzar la detección de cambios
      } else {
        this.errorMessage = 'Persona no encontrada en la lista.';
      }
    } else {
      this.errorMessage = 'Formulario incompleto o inválido.';
    }
    console.log('Instructores:', this.instructores);
    console.log('Aprendices:', this.aprendices);
  }

  handleCancel(): void {
    this.isModalVisible = false;
    this.form.reset();
  }
}
