import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { KnowledgeNetworkModel } from '@shared/models/knowledg-network.model';
import { KnowledgeNetworkService } from '@shared/services/knowledge-network.service';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTableComponent } from 'ng-zorro-antd/table';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-session',
  standalone: true,
  imports: [NzTableComponent,CommonModule,NzInputModule],
  templateUrl: './session.component.html',
  styleUrl: './session.component.css'
})
export class SessionComponent implements OnInit {

  private knowledge_network_service = inject(KnowledgeNetworkService)
  knowledge_network:KnowledgeNetworkModel[] = [];

  ngOnInit(): void {
    this.getData()
  }

  id:number = 1;

  getData(){
    const data_sub = forkJoin([ this.knowledge_network_service.getKnowledgeNetwork(this.id)]).subscribe({
      next: ([knowledge_network]) => {
        this.knowledge_network = knowledge_network
      }
    })
  }

  openModal(){
    console.log('open modal');
  }

}
