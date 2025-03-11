import { CommonModule } from '@angular/common';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChargeExcelService } from '@shared/services/charge-excel.service';
import { NullEncryptedPrivateChannel } from 'laravel-echo/dist/channel';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormControlComponent } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationComponent, NzNotificationModule, NzNotificationService } from 'ng-zorro-antd/notification';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzOptionComponent, NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzUploadChangeParam, NzUploadModule } from 'ng-zorro-antd/upload';
import { finalize, lastValueFrom, Subscription } from 'rxjs';
import { NzProgressModule } from 'ng-zorro-antd/progress';

@Component({
  selector: 'app-charge-button',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    NzButtonModule,
    NzModalModule,
    NzTableModule,
    NzDividerModule,
    NzSelectModule,
    NzIconModule,
    NzInputModule,
    NzPaginationModule,
    NzUploadModule,
    NzTabsModule,
    NzProgressModule

  ],
  templateUrl: './charge-button.component.html',
  styleUrl: './charge-button.component.css'
})
export class ChargeButtonComponent implements OnInit {

  @Input() requiredFileType: string | null = null;

  uploading = false
  uploadComplete = false

  uploadSub: Subscription | null = null;

  private chargeExcelService = inject(ChargeExcelService)
  private notification = inject(NzNotificationService)
  isVisibleCargue = false

  selectedFile: { [key: string]: File | null } = {
    file_courses: null,
    file_apprentices: null,
    file_instructors: null,
  };

  ngOnInit(): void {
  }

  formExcel = new FormGroup({
    file_courses: new FormControl('', [Validators.required]),
    file_apprentices: new FormControl('', [Validators.required]),
    file_instructors: new FormControl('', [Validators.required]),
  })

  get fieldFileExcelCourse() {
    return this.formExcel.get('file_courses') as FormControl;
  }
  get fieldFileExcelApprentices() {
    return this.formExcel.get('file_apprentices') as FormControl;
  }
  get fieldFileExcelInstructors() {
    return this.formExcel.get('file_instructors') as FormControl;
  }

  handleFileSelection(event: any, field: keyof typeof this.selectedFile) {
    const file: File = event.target.files[0];


    if (file) {
      this.selectedFile[field] = file;
    } else {
      this.notification.create(
        'warning',
        'Advertencia',
        'No se ha seleccionado un archivo'
      );
    }

  }

  fileUpload(fileType: string) {

    const file = this.selectedFile[fileType];

    if (!file) {
      this.notification.create('warning', 'Advertencia', 'Debe seleccionar un archivo antes de subirlo.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);


    this.uploading = true
    this.uploadComplete = false
    let uploadService

    if (fileType === 'file_courses') {
      uploadService = this.chargeExcelService.postExcelCourse(formData)
    } else if (fileType === 'file_apprentices') {
      uploadService = this.chargeExcelService.postExcelApprentices(formData);
    } else if (fileType === 'file_instructors') {
      uploadService = this.chargeExcelService.postExcelInstructors(formData);
    }

    // Realizar la carga
    this.uploadSub = uploadService!
    .pipe(
      finalize(() => this.reset())
    )
    .subscribe({
      next: (event: HttpEvent<any>) => {
        if (event.type === HttpEventType.Response) {
          this.uploadComplete = true;
          this.selectedFile[fileType] = null
          this.notification.create(
            'success',
            'Exito',
            'Archivo subido correctamente, porfavor recarga la pagina'
          )
        } 
      }
    });

  }

  reset() {
    this.uploading = false;
    this.uploadSub = null;
  }

  handleCancel() {
    if (this.uploading) return
    this.isVisibleCargue = false;
  }

  handleOk() {
    if (this.uploading) return
    this.isVisibleCargue = false;
  }




}
