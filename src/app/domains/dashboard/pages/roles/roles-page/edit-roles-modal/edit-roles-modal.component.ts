import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserModel } from '@shared/models/user.model';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { RolesModel } from '@shared/models/roles-model';
import { ApiRolesService } from '@shared/services/api-roles.service';
import { CourseService } from '@shared/services/program/course.service';
import { KnowledgeNetworkService } from '@shared/services/knowledge-network.service';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { CommonModule } from '@angular/common';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApprenticeService } from '@shared/services/apprentice.service';
import { InstructorService } from '@shared/services/instructor.service';

@Component({
  selector: 'app-edit-roles-modal',
  standalone: true,
  imports: [
    CommonModule,
    NzModalModule,
    NzButtonModule,
    NzSelectModule,
    NzFormModule,
    NzInputModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './edit-roles-modal.component.html',
  styleUrl: './edit-roles-modal.component.css'
})
export class EditRolesModalComponent implements OnInit {

  @Output() updatedUsers: EventEmitter<void> = new EventEmitter();
  @Input() userData?: UserModel | null;

  // Variables
  isVisible = false;
  form!: FormGroup;
  roles: RolesModel[] = [];
  courses: any[] = [];
  knowledgeNetworks: any[] = [];
  selectedRoles: number[] = [];
  loading = false;
  loadingData = false;
  originalRoles: number[] = [];
  
  // Estados de bloqueo
  isApprenticeLocked = false;
  isInstructorLocked = false;

  // Estados
  apprenticeState = [
    { value: 'Formacion', label: 'Formación' },
    { value: 'Desertado', label: 'Desertado' },
    { value: 'Etapa_productiva', label: 'Etapa productiva' },
    { value: 'Retiro_voluntario', label: 'Retiro voluntario' }
  ];

  instructorState = [
    { value: 'Activo', label: 'Activo' },
    { value: 'Inactivo', label: 'Inactivo' }
  ]

  // Inyección de servicios
  private rolesService = inject(ApiRolesService);
  private coursesService = inject(CourseService);
  private knowledgeNetworkService = inject(KnowledgeNetworkService);
  private notification = inject(NzNotificationService);
  private fb = inject(FormBuilder);
  private apprenticeService = inject(ApprenticeService);
  private instructorService = inject(InstructorService);

  ngOnInit() {
    this.initForm();
    this.loadStaticData();
  }

  isFormValid(): boolean {
    // Verificar si el formulario principal es válido (ignorando campos deshabilitados)
    if (this.form.invalid) {
      for (const [key, control] of Object.entries(this.form.controls)) {
        if (control.invalid && control.enabled) {
          return false;
        }
      }
    }

    // Validación específica para roles
    const values = this.form.value;
    const selectedRoles = values.role_ids || [];

    // Verificar si hay al menos un rol seleccionado
    if (selectedRoles.length === 0) {
      return false;
    }

    return true;
  }

  initForm() {
    this.form = this.fb.group({
      role_ids: [[], Validators.required],
      course_id: [null],
      state: [null],
      knowledge_network_id: [null]
    });
  
    // Escuchar cambios en los roles para actualizar validaciones
    this.form.get('role_ids')?.valueChanges.subscribe(() => {
      this.updateConditionalValidators();
    });
  }

  private validateRoleChanges(newRoles: number[]): void {
    const protectedRoles = this.getProtectedRoles();

    protectedRoles.forEach(role => {
      if (this.originalRoles.includes(role.id)) {
        // Solo mostrar advertencia si el usuario intenta quitar completamente un rol protegido
        if (!newRoles.includes(role.id)) {
          this.notification.warning(
            'Acción no permitida',
            `No puedes eliminar el rol ${role.name} una vez asignado`
          );
          newRoles.push(role.id);
          this.form.get('role_ids')?.setValue([...new Set(newRoles)], {emitEvent: false});
        }
      }
    });

    // Actualizar estados de bloqueo
    this.isApprenticeLocked = this.originalRoles.includes(
      this.roles.find(r => r.name === 'Aprendiz')?.id || 0
    );
    this.isInstructorLocked = this.originalRoles.includes(
      this.roles.find(r => r.name === 'Instructor')?.id || 0
    );

    // Actualizar campos bloqueados
    if (this.isApprenticeLocked) {
      this.lockApprenticeFields();
    } else {
      this.unlockApprenticeFields();
    }

    if (this.isInstructorLocked) {
      this.lockInstructorFields();
    } else {
      this.unlockInstructorFields();
    }
  }

  private lockApprenticeFields(): void {
    this.form.get('course_id')?.disable();
    this.form.get('state')?.disable();
  }

  private unlockApprenticeFields(): void {
    this.form.get('course_id')?.enable();
    this.form.get('state')?.enable();
  }

  private lockInstructorFields(): void {
    this.form.get('knowledge_network_id')?.disable();
  }

  private unlockInstructorFields(): void {
    this.form.get('knowledge_network_id')?.enable();
  }

  private unlockAllFields(): void {
    this.unlockApprenticeFields();
    this.unlockInstructorFields();
  }

  private getProtectedRoles(): RolesModel[] {
    return this.roles.filter(role =>
      role.name === 'Usuario' ||
      role.name === 'Aprendiz' ||
      role.name === 'Instructor'
    );
  }

  private updateConditionalValidators(): void {
    const courseControl = this.form.get('course_id');
    const stateControl = this.form.get('state');
    const networkControl = this.form.get('knowledge_network_id');
  
    // Resetear validadores
    courseControl?.clearValidators();
    stateControl?.clearValidators();
    networkControl?.clearValidators();

    // Aplicar validadores condicionales solo si no están bloqueados
    if (this.isApprenticeSelected && !this.isApprenticeLocked) {
      courseControl?.setValidators(Validators.required);
      stateControl?.setValidators(Validators.required);
    }

    if (this.isInstructorSelected && !this.isInstructorLocked) {
      networkControl?.setValidators(Validators.required);
    }
  
    // Actualizar estado de validación
    courseControl?.updateValueAndValidity();
    stateControl?.updateValueAndValidity();
    networkControl?.updateValueAndValidity();
  }

  loadStaticData() {
    // Cargar roles
    this.rolesService.getRoles().subscribe({
      next: (data) => this.roles = data,
      error: (error) => console.error('Error loading roles', error)
    });

    // Cargar cursos
    this.coursesService.getCourses().subscribe({
      next: (data) => this.courses = data,
      error: (error) => console.error('Error loading courses', error)
    });

    // Cargar redes de conocimiento
    this.knowledgeNetworkService.getknowledgeNetwork().subscribe({
      next: (data) => this.knowledgeNetworks = data,
      error: (error) => console.error('Error loading knowledge networks', error)
    });
  }

  setData(user: UserModel): void {
    this.userData = user;
    this.loadingData = true;

    // Obtener roles actuales del usuario (ahora vienen directamente en user.roles como strings)
    const roleNames = user.roles || [];

    // Mapear nombres de roles a IDs (si es necesario)
    const currentRoleIds = this.roles
      .filter(role => roleNames.includes(role.name))
      .map(role => role.id);

    this.selectedRoles = currentRoleIds;

    // Inicializar formulario con valores base
    const formData: any = {
      role_ids: currentRoleIds,
      course_id: null,
      state: null,
      knowledge_network_id: null
    };

    // Cargar datos adicionales si el usuario es aprendiz o instructor
    if (this.isApprenticeSelected) {
      this.apprenticeService.getApprenticeByUserId(user.id).subscribe({
        next: (response) => {
          formData.course_id = response?.apprentice_data?.course_id;
          formData.state = response?.apprentice_data?.state;
          this.initializeForm(formData);
        },
        error: (error) => console.error('Error loading apprentice data', error)
      });
    }

    if (this.isInstructorSelected) {
      this.instructorService.getInstructorByUserId(user.id).subscribe({
        next: (response) => {
          formData.knowledge_network_id = response?.instructor_data?.knowledge_network_id;
          this.initializeForm(formData);
        },
        error: (error) => console.error('Error loading instructor data', error)
      });
    }

    // Si no hay roles adicionales, inicializar el formulario directamente
    if (!this.isApprenticeSelected && !this.isInstructorSelected) {
      this.initializeForm(formData);
    }

    this.loadingData = false;
  }

  private initializeForm(data: any): void {
    this.form.patchValue(data, { emitEvent: false });
    this.updateFieldLockStates();
  }

  private updateFieldLockStates(): void {
    const hasOriginalApprentice = this.originalRoles.includes(
      this.roles.find(r => r.name === 'Aprendiz')?.id || 0
    );
    const hasOriginalInstructor = this.originalRoles.includes(
      this.roles.find(r => r.name === 'Instructor')?.id || 0
    );

    this.isApprenticeLocked = hasOriginalApprentice;
    this.isInstructorLocked = hasOriginalInstructor;

    if (this.isApprenticeLocked) {
      this.lockApprenticeFields();
    }

    if (this.isInstructorLocked) {
      this.lockInstructorFields();
    }
  }

  get isApprenticeSelected(): boolean {
    if (!this.selectedRoles || !this.roles) return false;
    const apprenticeRole = this.roles.find(r => r.name === 'Aprendiz');
    return apprenticeRole ? this.selectedRoles.includes(apprenticeRole.id) : false;
  }

  get isInstructorSelected(): boolean {
    if (!this.selectedRoles || !this.roles) return false;
    const instructorRole = this.roles.find(r => r.name === 'Instructor');
    return instructorRole ? this.selectedRoles.includes(instructorRole.id) : false;
  }

  onRolesChange(selectedRoles: number[]): void {
    this.selectedRoles = selectedRoles;
    this.updateConditionalValidators();
  
    if (!this.isApprenticeSelected) {
      this.form.get('course_id')?.reset();
      this.form.get('state')?.reset();
    }
  
    if (!this.isInstructorSelected) {
      this.form.get('knowledge_network_id')?.reset();
    }
  }

  openModal(): void {
    this.isVisible = true;
  }

  handleCancel(): void {
    this.isVisible = false;
    this.form.reset();
  }

  handleOk(): void {
    if (!this.userData) {
      this.notification.error('Error', 'Datos de usuario no disponibles');
      return;
    }
  
    this.loading = true;
    
    // Obtener todos los valores del formulario, incluyendo los deshabilitados
    const formValue = {
      ...this.form.getRawValue(), // Esto incluye campos deshabilitados
      role_ids: this.selectedRoles
    };
  
    // Verificar si estamos manteniendo el rol de aprendiz pero los campos están bloqueados
    const isKeepingApprentice = this.originalRoles.some(id => 
      id === this.roles.find(r => r.name === 'Aprendiz')?.id
    );
    
    if (this.isApprenticeSelected && isKeepingApprentice && !formValue.course_id) {
      // Recuperar los valores originales si estamos manteniendo el rol pero los campos están bloqueados
      this.apprenticeService.getApprenticeByUserId(this.userData.id).subscribe({
        next: (response) => {
          formValue.course_id = response?.apprentice_data?.course_id;
          formValue.state = response?.apprentice_data?.state;
          this.sendUpdateRequest(formValue);
        },
        error: (error) => {
          this.loading = false;
          this.notification.error('Error', 'No se pudieron recuperar los datos del aprendiz');
        }
      });
    } else {
      this.sendUpdateRequest(formValue);
    }
  }
  
  private sendUpdateRequest(formData: any): void {
    this.rolesService.assignRoles(
      this.userData!.id.toString(),
      formData.role_ids,
      formData.course_id,
      formData.state,
      formData.knowledge_network_id
    ).subscribe({
      next: () => {
        this.updatedUsers.emit();
        this.notification.success('Éxito', 'Roles actualizados correctamente');
        this.isVisible = false;
        this.originalRoles = [...formData.role_ids];
      },
      error: (error) => {
        this.notification.error('Error', error.error?.message || 'Error al actualizar roles');
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}