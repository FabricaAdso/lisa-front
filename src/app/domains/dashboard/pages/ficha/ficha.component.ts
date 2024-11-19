import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzGridModule } from 'ng-zorro-antd/grid';

@Component({
  selector: 'app-ficha',
  standalone: true,
  imports:  [
    CommonModule,
    NzCardModule,
    NzCollapseModule,
    NzButtonModule,
    NzGridModule
  ],
  templateUrl: './ficha.component.html',
  styleUrl: './ficha.component.css'
})
export class FichaComponent {

  fichas = [
    {
      number: 2774315,
      program: 'Análisis y desarrollo de software',
      site: 'Inem',
      environment: 105,
      session: '7:00 - 13:00',
      date: '13/09/2024'
    },
    {
      number: 2774315,
      program: 'Análisis y desarrollo de software',
      site: 'Inem',
      environment: 105,
      session: '7:00 - 13:00',
      date: '13/09/2024'
    },
    {
      number: 2774315,
      program: 'Análisis y desarrollo de software',
      site: 'Inem',
      environment: 105,
      session: '7:00 - 13:00',
      date: '13/09/2024'
    },
    {
      number: 2774315,
      program: 'Análisis y desarrollo de software',
      site: 'Inem',
      environment: 105,
      session: '7:00 - 13:00',
      date: '13/09/2024'
    },
    {
      number: 2774315,
      program: 'Análisis y desarrollo de software',
      site: 'Inem',
      environment: 105,
      session: '7:00 - 13:00',
      date: '13/09/2024'
    },
    {
      number: 2774315,
      program: 'Análisis y desarrollo de software',
      site: 'Inem',
      environment: 105,
      session: '7:00 - 13:00',
      date: '13/09/2024'
    },
    {
      number: 2774315,
      program: 'Análisis y desarrollo de software',
      site: 'Inem',
      environment: 105,
      session: '7:00 - 13:00',
      date: '13/09/2024'
    },
    {
      number: 2774315,
      program: 'Análisis y desarrollo de software',
      site: 'Inem',
      environment: 105,
      session: '7:00 - 13:00',
      date: '13/09/2024'
    },
    {
      number: 2774315,
      program: 'Análisis y desarrollo de software',
      site: 'Inem',
      environment: 105,
      session: '7:00 - 13:00',
      date: '13/09/2024'
    },
    {
      number: 2774315,
      program: 'Análisis y desarrollo de software',
      site: 'Inem',
      environment: 105,
      session: '7:00 - 13:00',
      date: '13/09/2024'
    },
    {
      number: 2774315,
      program: 'Análisis y desarrollo de software',
      site: 'Inem',
      environment: 105,
      session: '7:00 - 13:00',
      date: '13/09/2024'
    },
    {
      number: 2774315,
      program: 'Análisis y desarrollo de software',
      site: 'Inem',
      environment: 105,
      session: '7:00 - 13:00',
      date: '13/09/2024'
    },
    {
      number: 2774315,
      program: 'Análisis y desarrollo de software',
      site: 'Inem',
      environment: 105,
      session: '7:00 - 13:00',
      date: '13/09/2024'
    },
    {
      number: 2774315,
      program: 'Análisis y desarrollo de software',
      site: 'Inem',
      environment: 105,
      session: '7:00 - 13:00',
      date: '13/09/2024'
    },
    {
      number: 2774315,
      program: 'Análisis y desarrollo de software',
      site: 'Inem',
      environment: 105,
      session: '7:00 - 13:00',
      date: '13/09/2024'
    },
    {
      number: 2774315,
      program: 'Análisis y desarrollo de software',
      site: 'Inem',
      environment: 105,
      session: '7:00 - 13:00',
      date: '13/09/2024'
    },
    {
      number: 2774315,
      program: 'Análisis y desarrollo de software',
      site: 'Inem',
      environment: 105,
      session: '7:00 - 13:00',
      date: '13/09/2024'
    },

    
  ];

  historialFichas = [
    {
      number: 2774315,
      program: 'Análisis y desarrollo de software',
      site: 'Inem',
      environment: 105,
      session: '7:00 - 13:00',
      date: '13/09/2024'
    },
    {
      number: 2774315,
      program: 'Análisis y desarrollo de software',
      site: 'Inem',
      environment: 105,
      session: '7:00 - 13:00',
      date: '13/09/2024'
    },
    {
      number: 2774315,
      program: 'Análisis y desarrollo de software',
      site: 'Inem',
      environment: 105,
      session: '7:00 - 13:00',
      date: '13/09/2024'
    },
    {
      number: 2774315,
      program: 'Análisis y desarrollo de software',
      site: 'Inem',
      environment: 105,
      session: '7:00 - 13:00',
      date: '13/09/2024'
    },
    {
      number: 2774315,
      program: 'Análisis y desarrollo de software',
      site: 'Inem',
      environment: 105,
      session: '7:00 - 13:00',
      date: '13/09/2024'
    },
    {
      number: 2774315,
      program: 'Análisis y desarrollo de software',
      site: 'Inem',
      environment: 105,
      session: '7:00 - 13:00',
      date: '13/09/2024'
    },
    {
      number: 2774315,
      program: 'Análisis y desarrollo de software',
      site: 'Inem',
      environment: 105,
      session: '7:00 - 13:00',
      date: '13/09/2024'
    },
    {
      number: 2774315,
      program: 'Análisis y desarrollo de software',
      site: 'Inem',
      environment: 105,
      session: '7:00 - 13:00',
      date: '13/09/2024'
    },
    {
      number: 2774315,
      program: 'Análisis y desarrollo de software',
      site: 'Inem',
      environment: 105,
      session: '7:00 - 13:00',
      date: '13/09/2024'
    },
    {
      number: 2774315,
      program: 'Análisis y desarrollo de software',
      site: 'Inem',
      environment: 105,
      session: '7:00 - 13:00',
      date: '13/09/2024'
    },
    
  ];



}
