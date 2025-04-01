import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { CourseModel } from '@shared/models/course.model';
import { finalize } from 'rxjs';

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

  initForm() {
    this.form = this.fb.group({
      role_ids: [[], Validators.required],
      course_id: [null],
      state: [null],
      knowledge_network_id: [null]
    });
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

    // Obtener roles actuales del usuario
    const currentRoles = user.training_centers?.map(tc => tc.pivot.role_id) || [];
    this.selectedRoles = currentRoles;

    // Inicializar formulario con valores base
    const formData: any = { role_ids: currentRoles };

    // Verificar roles y cargar datos adicionales
    const requests = [];

    if (this.isApprenticeSelected) {
      requests.push(this.apprenticeService.getApprenticeByUserId(user.id));
    }

    if (this.isInstructorSelected) {
      requests.push(this.instructorService.getInstructorByUserId(user.id));
    }

    if (requests.length > 0) {
      Promise.all(requests.map(req => req.toPromise()))
        .then((responses) => {
          responses.forEach(response => {
            if (response?.apprentice_data) {
              formData.course_id = response.apprentice_data.course_id;
              formData.state = response.apprentice_data.state;
            }
            if (response?.instructor_data) {
              formData.knowledge_network_id = response.instructor_data.knowledge_network_id;
            }
          });
          this.initializeForm(formData);
        })
        .catch(error => {
          console.error('Error loading role data:', error);
          this.initializeForm(formData);
        })
        .finally(() => {
          this.loadingData = false;
        });
    } else {
      this.initializeForm(formData);
      this.loadingData = false;
    }
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
    if (this.form.invalid || !this.userData) {
      this.notification.error('Error', 'Complete todos los campos requeridos');
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
