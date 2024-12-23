import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { AddProgramFormComponent } from "../../components/add-program-form/add-program-form.component";
import { ProgramModel } from '@shared/models/program.model';

@Component({
  selector: 'app-add-program-modal',
  standalone: true,
  imports: [NzModalModule, CommonModule, NzButtonModule, NzPopconfirmModule, AddProgramFormComponent],
  templateUrl: './add-program-modal.component.html',
  styleUrl: './add-program-modal.component.css'
})
export class AddProgramModalComponent {
  isVisible = false;
  isOkLoading = false;
  @Output() programData = new EventEmitter<ProgramModel>();
  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    this.isOkLoading = true;
    setTimeout(() => {
      this.isVisible = false;
      this.isOkLoading = false;
    }, 3000);
  }

  handleCancel(): void {
    this.isVisible = false;
  }
}
