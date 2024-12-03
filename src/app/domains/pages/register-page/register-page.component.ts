import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, inject, OnInit, Output, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { AuthLayoutComponent } from '@domains/auth/auth-layout/auth-layout.component';
import { CreateUserDTO } from '@shared/dto/create-user.dto';
import { DocumentTypeModel } from '@shared/models/document-type.model';
import { RegionalModel } from '@shared/models/regional.model';
import { TrainingCenterModel } from '@shared/models/training-center.model';
import { UserModel } from '@shared/models/user.model';
import { DocumentTypeService } from '@shared/services/document-type.service';
import { RegionalService } from '@shared/services/regional.service';
import { TrainingCentreService } from '@shared/services/training-center.service';
import { UserService } from '@shared/services/user.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzOptionComponent, NzSelectModule } from 'ng-zorro-antd/select';
import { filter, forkJoin, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [NzFormModule, CommonModule, FormsModule,ReactiveFormsModule,NzInputModule,NzIconModule,NzButtonModule,NzOptionComponent,NzSelectModule],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css',
  providers:[NzNotificationService]
})
export class RegisterPageComponent implements OnInit {
  
  @Output() switchView = new EventEmitter<void>();

  private router = inject(Router);
  private notification = inject(NzNotificationService);
  private regional_service = inject(RegionalService);
  private training_center_service = inject(TrainingCentreService)

  private formBuilder = Inject(FormBuilder);

  private document_type_service = inject(DocumentTypeService);
  private user_service = inject(UserService)

  regional:RegionalModel[] = [];
  trainingCenters:TrainingCenterModel[] = [];
  passwordVisible:boolean = false;
  document_type: DocumentTypeModel[] = [];
  user:UserModel[] = [];
  button_value = signal(false);


  ngOnInit(): void {
    this.getData();
    this.changeRegional();
  }

  createBasicNotification(): void {
    this.notification
      .blank(
        'Registro exitoso',
        'Inicie sesion'
      )
  }

  getData(){
    const data_sub = forkJoin([
      this.document_type_service.getAll(),
      this.regional_service.getAllRegional()
    ]).subscribe({
      next: ([document_type,regional]) => {
        this.document_type = [...document_type];  
        this.regional = [...regional];
      },
      complete(){
        data_sub.unsubscribe()
      }
    })
  }

  stateButton(){
    this.button_value.set(this.formRegister.valid);
  }

  onSubmit(){
    if(this.formRegister.valid){
      console.log(this.formRegister.value);
      
    const register: CreateUserDTO  = this.formRegister.value as CreateUserDTO;

    this.user_service.create(register).subscribe({
      next: (data) => {
        let user = [...this.user,data]
        this.createBasicNotification();
        setTimeout(() => {
          this.router.navigate(['auth/login']);
        }, 600);
      }
    })
    }else{
      this.formRegister.markAllAsTouched()
    }
  }

  valuePassword(){
    setTimeout(() => {
      let password =  this.formRegister.get('password')!.value;
      let confirmPassword =  this.formRegister.get('password_confirmation')!.value;
     if(password === confirmPassword){
      const password_true = true;
     }else{
      const password_false = false;
     }
    }, 100);
  }

  formRegister = new FormGroup({
    identity_document: new  FormControl('', [Validators.required]),
    document_type_id:  new FormControl('', [Validators.required]),
    first_name: new FormControl('', [Validators.required]),
    last_name: new FormControl('',[Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    password_confirmation:  new FormControl('', [Validators.required, Validators.minLength(8)]),
    training_center_id: new FormControl('',[Validators.required]),
    reguinal: new FormControl('',[Validators.required]),
  })

  get fielReguional(){
    return this.formRegister.get('reguinal') as FormControl;
  }

  get fieldTrainingCenter(){
    return this.formRegister.get('training_center_id') as FormControl;
  }

  goLogin(){
    this.router.navigate(['auth/login']);
  }

  registrarse(){
    this.formRegister = this.formBuilder.group()
  } 

  changeRegional(): void {
    this.fielReguional.valueChanges.pipe(
      filter((value): value is number => value !== null), 
      switchMap((regional: number) => {
        this.fieldTrainingCenter.reset();
        return this.training_center_service.getTrainigCentersByRegional(regional).pipe(
          tap((trainingCenters) => {
            if (trainingCenters.length === 0) {
              alert('Data not found');
            }
            this.trainingCenters = trainingCenters
          })
        );
      })
    ).subscribe({
      error: (err) => console.error('Error fetching training centers:', err),
    });
  }
  
}
