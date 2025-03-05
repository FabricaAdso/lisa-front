import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChargeExcelService } from '@shared/services/charge-excel.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormControlComponent } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzOptionComponent, NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzUploadChangeParam, NzUploadModule } from 'ng-zorro-antd/upload';

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
    NzFormControlComponent
  ],
  templateUrl: './charge-button.component.html',
  styleUrl: './charge-button.component.css'
})
export class ChargeButtonComponent {

  private messageService = inject(NzMessageService)
  private chargeExcelService = inject(ChargeExcelService)

  isVisibleCargue = false;

  formExcel = new FormGroup({
        file: new  FormControl('', [Validator.required]),
    })
  
    get fieldFileExcel(){
      return this.formExcel.get('file') as FormControl;
    }
  

  handleChange({ file, fileList }: NzUploadChangeParam): void {
  
      this.chargeExcelService.postExcel(file).subscribe({
        next: (response: any) => {
          console.log('fileeeeeeeee:  ',response);
        }
      })
  
      const status = file.status;
      if (status !== 'uploading') {
        console.log(file, fileList);
      }
      if (status === 'done') {
        this.messageService.success(`${file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        this.messageService.error(`${file.name} file upload failed.`);
      }
    }

  handleCancel(){
    this.isVisibleCargue = false;
  }

  handleOk(){
    this.isVisibleCargue = false;
  }

}
