import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzInputModule } from 'ng-zorro-antd/input';
import {NgIconComponent, provideIcons} from '@ng-icons/core';
import {ionSearch} from '@ng-icons/ionicons'
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-progam-page',
  standalone: true,
  imports: [CommonModule,NzInputModule,NgIconComponent,NzIconModule],
  templateUrl: './progam-page.component.html',
  styleUrl: './progam-page.component.css',
  viewProviders:[provideIcons({ionSearch})]
})
export class ProgamPageComponent {

}
