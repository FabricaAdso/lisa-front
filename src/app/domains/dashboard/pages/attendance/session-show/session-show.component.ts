import { Component, inject, OnInit } from '@angular/core';
import { InstructorModel } from '@shared/models/instructor.model';
import { SessionModel } from '@shared/models/session.model';
import { AssistanceService } from '@shared/services/assistance.service';
import { InstructorService } from '@shared/services/instructor.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzTimelineModule } from 'ng-zorro-antd/timeline';

@Component({
  selector: 'app-session-show',
  standalone: true,
  imports: [NzButtonModule, NzModalModule,NzTimelineModule],
  templateUrl: './session-show.component.html',
  styleUrl: './session-show.component.css'
})
export class SessionShowComponent implements OnInit {

  isModalVisible = false
  private instructor_service = inject(InstructorService);

  instructor:InstructorModel[] = []

  ngOnInit(): void {
    this.getData()
  }
  getData(){
    this.instructor_service.getInstructors({included: ['sessions']}).subscribe({
     next : (instructor) => {
      this.instructor = instructor
     }
    })
  }

  openModal(){
    this.isModalVisible = true;
    console.log('modal desde el hijo');
  }

  closeModal(){
    this.isModalVisible = false;
  }

}
