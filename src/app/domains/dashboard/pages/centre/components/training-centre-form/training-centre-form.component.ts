import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, inject, Input, input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TrainingCentreModel } from '@shared/models/training-centre-model';
import { TrainingCentreService } from '@shared/services/training-centre.service';
import { noWhiteSpaceValidator } from '@shared/validators/no-wite-space.validator';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { debounceTime, distinctUntilChanged, of, Subscription, switchMap } from 'rxjs';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { RegionalService } from '@shared/services/regional.service';
import { RegionalModel } from '@shared/models/regional.model';

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
    NzSelectModule
  ],
  templateUrl: './training-centre-form.component.html',
  styleUrl: './training-centre-form.component.css'
})
export class TrainingCentreFormComponent {

  private formBuilder = inject(FormBuilder);
  private centreService = inject(TrainingCentreService);
  private regionalService = inject(RegionalService);

  @Input()centre?: TrainingCentreModel | undefined;
  @Input() isVisible:boolean | undefined ;

  @Output() update = new EventEmitter<TrainingCentreModel>();
  @Output() create = new EventEmitter<TrainingCentreModel>();
  @Output() closeModal = new EventEmitter<void>();

  form:FormGroup;
  saveSub:Subscription|null = null;
  dataSub:Subscription|null = null;
  loading:boolean  = false;
  regions: RegionalModel[] = [];


  constructor(
    private notification: NzNotificationService){
    this.form = this.formBuilder.group({
      name:new FormControl(null,[Validators.required, Validators.minLength(5),noWhiteSpaceValidator()]),
      code: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
      regional_id: new FormControl(null, [Validators.required])
    },);
  }

  @ViewChild('firstInput', { static: false }) firstInput!: ElementRef;

  ngOnInit(): void {
    //console.log(this.form.get('name'));
    
    if(this.centre){
      this.form.addControl('id',new FormControl(this.centre.id));
      this.form.get('name')!.setValue(this.centre.name);
    }
    this.loadRegions();


      // Validación en tiempo real del campo 'code'
      this.form.get('code')!.valueChanges.pipe(
        debounceTime(300), // Espera 300ms después de cada cambio
        distinctUntilChanged(), // Solo emite si el valor cambió
        switchMap((code: string) => {
          if (!code || code.trim() === '') {
            // Si el campo está vacío, marca el campo como inválido con el error 'required'
            this.form.get('code')!.setErrors({ required: true });
            return of({ exists: false }); // Retorna un observable con un valor por defecto
          }
          return this.centreService.checkCodeExists(code);
        })
      ).subscribe({
        next: (response) => {
          if (response.exists) {
            this.form.get('code')!.setErrors({ codeExists: true }); // Marca el campo como inválido
          } else {
            // Limpia los errores, excepto 'required' si el campo está vacío
            const errors = this.form.get('code')!.errors;
            if (errors && errors['required']) {
              this.form.get('code')!.setErrors({ required: true });
            } else {
              this.form.get('code')!.setErrors(null);
            }
          }
        },
        error: (err) => {
          console.error('Error al verificar el código:', err);
          this.form.get('code')!.setErrors(null); // Limpia los errores en caso de error
        }
      });








  }




  ngOnChanges(changes: SimpleChanges): void {
    if (changes['centre'] && this.centre) {
      console.log('Centro recibido:', this.centre); // 🔍 Verifica si se actualiza

      // Actualizar el formulario con los valores del centro recibido
      this.form.patchValue({
        name: this.centre.name || '',
        code: this.centre.code || '',
        regional_id: this.centre.regional_id || null
      });

      // Agregar ID si existe (para edición)
      if (this.centre.id) {
        if (!this.form.contains('id')) {
          this.form.addControl('id', new FormControl(this.centre.id));
        } else {
          this.form.get('id')!.setValue(this.centre.id);
        }
      }
    }
  }





  loadRegions() {
    this.regionalService.getAllRegional().subscribe((data) => {
      
      this.regions = data || [];
    });
  }

  ngOnDestroy(): void {
    if(this.saveSub) this.saveSub.unsubscribe();
  }

  editCentre() {
    if (this.form.invalid) return;
    this.loading = true;
    const { value } = this.form;
    this.saveSub = this.centreService.update(value).subscribe({
      next: (new_centre) => {
        this.update.emit(new_centre);
        this.closeModal.emit();
      }
    });
  }

  createCentre() {
    if (this.form.invalid) return;
    this.loading = true;
    const { value } = this.form;
    this.saveSub = this.centreService.create(value).subscribe({
      next: (new_centre) => {
        this.create.emit(new_centre); // Emite el evento de creación
        this.closeModal.emit(); // Emite el cierre para que el padre oculte el modal
        //this.notificacion("Se creó el centro " + new_centre.name + " correctamente", "Centro");
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
  submitForm() {
    if (this.form.valid) {
      this.saveData(); // Llama a la función de guardado o envío
    } else {
      this.form.markAllAsTouched(); // Marca todos los campos para mostrar errores
    }
  }

}
