import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { NgIconComponent } from '@ng-icons/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { BulkUploadModalComponent } from '../../modals/bulk-upload-modal/bulk-upload-modal.component';
import { AddProgramModalComponent } from '../../modals/add-program-modal/add-program-modal.component';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { SessionModel } from '@shared/models/session.model';
import { SessionService } from '@shared/services/program/session.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { noWhiteSpaceValidator } from '@shared/validators/no-wite-space.validator';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-session-form',
  standalone: true,
  imports:  [CommonModule, NzInputModule, NgIconComponent, NzIconModule, NzTableModule, NzDividerModule, NzButtonModule, NzFlexModule, NzPopconfirmModule, NzUploadModule, AddProgramModalComponent, BulkUploadModalComponent, NzSpaceModule, NzPaginationModule],

  templateUrl: './session-form.component.html',
  styleUrl: './session-form.component.css'
})
export class SessionFormComponent implements OnInit{

  private formBuilder = inject(FormBuilder);
  private sessionService = inject(SessionService);

  @Input() session?: SessionModel | undefined;
  @Input() isVisible: boolean | undefined;

  @Output() update = new EventEmitter<SessionModel>();
  @Output() create = new EventEmitter<SessionModel>();
  @Output() closeModal = new EventEmitter<void>();

  form: FormGroup;
  saveSub: Subscription | null = null;
  dataSub: Subscription | null = null;
  loading: boolean = false;


  constructor(
    private notification: NzNotificationService
  ) {
    this.form = this.formBuilder.group({
      name: new FormControl(null, [Validators.required, noWhiteSpaceValidator()])
    },);
  }

  ngOnInit(): void {
    if (this.session) {
      this.form.addControl('id', new FormControl(this.session.id));
      this.form.get('name')!.setValue(this.session.name);
    }
  }
  ngOnDestroy(): void {
    if (this.saveSub) this.saveSub.unsubscribe();
  }

  editSession() {
    if (this.form.invalid) return;
    this.loading = true;
    const { value } = this.form;
    this.saveSub = this.sessionService.update(value)
      .subscribe({
        next: (new_session) => {
          this.update.emit(new_session);
        }
      });
  }

  createSession() {
    if (this.form.invalid) return;
    this.loading = true;
    const { value } = this.form;
    this.saveSub = this.sessionService.create(value).subscribe({
      next: (new_session) => {
        this.create.emit(new_session); // Emite el evento de creación
        this.closeModal.emit(); // Emite el cierre para que el padre oculte el modal
        //this.notificacion("Se creó el centro " + new_centre.name + " correctamente", "Centro");
      }
    });
  }

  notificacion(Mensaje: string, titulo: string) {
    this.notification.blank(titulo, Mensaje);
  }


  saveData() {
    if (this.session) {
      this.editSession();
      return;
    }
    this.createSession();
  }
}
