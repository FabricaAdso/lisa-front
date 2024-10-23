import { group } from '@angular/animations';
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import(
        '@domains/dashboard/dashboard-layout/dashboard-layout.component'
      ).then((c) => c.DashboardLayoutComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
      {
        path: 'dashboard',
        title: 'Dashboard',
        loadComponent: () =>
          import(
            '@domains/dashboard/dashboard-layout/dashboard-layout.component'
          ).then((c) => c.DashboardLayoutComponent),
        data: {
          icono: 'casa',
          group: 'home',
          breadcrumb: '',
        },
        children: [
          {
            path: 'dashboard',
            title: 'Dashboard',
            loadComponent: () => import('@domains/dashboard/dashboard-layout/dashboard-layout.component').then((c) => c.DashboardLayoutComponent),
          },
        ],
      },
    ],
  },
];
