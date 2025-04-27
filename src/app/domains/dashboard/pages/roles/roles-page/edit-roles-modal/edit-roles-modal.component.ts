import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserModel } from '@shared/models/user.model';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { RolesModel } from '@shared/models/roles-model';
import { ApiRolesService } from '@shared/services/api-roles.service';
import { CourseService } from '@shared/services/course.service';
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
   // Nuevas propiedades para controlar el estado de los campos
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

  constructor(
    private apprenticeService: ApprenticeService,
    private instructorService: InstructorService
  ) { }

  ngOnInit() {
    this.initForm();
    this.loadStaticData();
  }

  isFormValid(): boolean {
    // Si el formulario no está inicializado o es inválido (excepto por campos deshabilitados)
    if (!this.form || this.form.invalid) {
      // Verificar si la invalidez viene de campos deshabilitados
      const invalidFromDisabled = this.checkInvalidFromDisabled();
      if (!invalidFromDisabled) {
        return false;
      }
    }

    const values = this.form.value;

    // Validación para aprendiz (solo si no está bloqueado)
    if (this.isApprenticeSelected && !this.isApprenticeLocked) {
      if (!values.course_id || !values.state) {
        return false;
      }
    }

    // Validación para instructor (solo si no está bloqueado)
    if (this.isInstructorSelected && !this.isInstructorLocked) {
      if (!values.knowledge_network_id) {
        return false;
      }
    }

    return true;
  }

  // Añade este nuevo método para verificar si la invalidez viene de campos deshabilitados
  private checkInvalidFromDisabled(): boolean {
    const controls = this.form.controls;

    // Si el formulario es inválido, verificar si los campos inválidos están deshabilitados
    if (this.form.invalid) {
      for (const key in controls) {
        if (controls[key].invalid) {
          // Si el campo está deshabilitado, ignoramos su invalidez
          if (controls[key].disabled) {
            continue;
          }
          // Si hay algún campo inválido que NO está deshabilitado
          return false;
        }
      }
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
    this.form.get('role_ids')?.valueChanges.subscribe((roles: number[]) => {
      this.validateRoleChanges(roles);
      this.updateConditionalValidators();
    });
  }
   /**
   * Valida los cambios en los roles para evitar eliminación no permitida
   * @param newRoles Nuevos roles seleccionados
   */
   private validateRoleChanges(newRoles: number[]): void {
    const protectedRoles = this.getProtectedRoles();

    protectedRoles.forEach(role => {
      if (this.originalRoles.includes(role.id)) {
        // Si el rol estaba originalmente y se intenta quitar
        if (!newRoles.includes(role.id)) {
          this.notification.warning(
            'Acción no permitida',
            `No puedes eliminar el rol ${role.name} una vez asignado`
          );
          newRoles.push(role.id);
          this.form.get('role_ids')?.setValue([...new Set(newRoles)]);
        }

        // Bloquear campos relacionados si el rol está presente
        if (role.name === 'Aprendiz') {
          this.isApprenticeLocked = true;
          this.lockApprenticeFields();
        }

        if (role.name === 'Instructor') {
          this.isInstructorLocked = true;
          this.lockInstructorFields();
        }
      }
    });
  }

  private lockApprenticeFields(): void {
    this.form.get('course_id')?.disable();
    this.form.get('state')?.disable();
  }

  private lockInstructorFields(): void {
    this.form.get('knowledge_network_id')?.disable();
  }

  private unlockAllFields(): void {
    this.form.get('course_id')?.enable();
    this.form.get('state')?.enable();
    this.form.get('knowledge_network_id')?.enable();
  }

  /**
   * Obtiene los roles protegidos (usuario, aprendiz, instructor)
   */
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


    // Aplicar validadores condicionales
    if (this.isApprenticeSelected) {
      courseControl?.setValidators(Validators.required);
      stateControl?.setValidators(Validators.required);
    }

    if (this.isInstructorSelected) {
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
    this.coursesService.getCoursesPage().subscribe({
      next: (data) => this.courses = data.data,
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
    this.isApprenticeLocked = false;
    this.isInstructorLocked = false;
    this.unlockAllFields();

    const roleNames = user.roles || [];
    const currentRoleIds = this.roles
      .filter(role => roleNames.includes(role.name))
      .map(role => role.id);

    this.selectedRoles = currentRoleIds;
    this.originalRoles = [...currentRoleIds];

    const formData: any = {
      role_ids: currentRoleIds,
      course_id: null,
      state: null,
      knowledge_network_id: null
    };

    // Verificar y bloquear campos si es necesario
    const hasApprenticeRole = roleNames.includes('Aprendiz');
    const hasInstructorRole = roleNames.includes('Instructor');

    if (hasApprenticeRole) {
      this.isApprenticeLocked = true;
      this.apprenticeService.getApprenticeByUserId(user.id).subscribe({
        next: (response) => {
          formData.course_id = response?.apprentice_data?.course_id;
          formData.state = response?.apprentice_data?.state;
          this.initializeForm(formData);
          this.lockApprenticeFields();
        },
        error: (error) => console.error('Error loading apprentice data', error)
      });
    }

    if (hasInstructorRole) {
      this.isInstructorLocked = true;
      this.instructorService.getInstructorByUserId(user.id).subscribe({
        next: (response) => {
          formData.knowledge_network_id = response?.instructor_data?.knowledge_network_id;
          this.initializeForm(formData);
          this.lockInstructorFields();
        },
        error: (error) => console.error('Error loading instructor data', error)
      });
    }

    if (!hasApprenticeRole && !hasInstructorRole) {
      this.initializeForm(formData);
    }

    this.loadingData = false;
  }

  // Getters mejorados para verificar roles
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
  private initializeForm(data: any): void {
    this.form.patchValue(data);
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
    const formValue = this.form.value;

    this.rolesService.assignRoles(
      this.userData.id.toString(),
      formValue.role_ids,
      formValue.course_id,
      formValue.state,
      formValue.knowledge_network_id
    ).subscribe({
      next: () => {
        this.updatedUsers.emit();
        this.notification.success('Éxito', 'Roles actualizados correctamente');
        this.isVisible = false;
       // Actualizar los roles originales después de una actualización exitososa
        this.originalRoles = [...formValue.role_ids];
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
