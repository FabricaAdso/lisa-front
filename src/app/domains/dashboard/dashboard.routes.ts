import { group } from '@angular/animations';
import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('@domains/dashboard/dashboard-layout/dashboard-layout.component').then(c => c.DashboardLayoutComponent),
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'environtments',
            },
            {
                path: 'roles',
                title: 'Administrar roles',
                data: {breadcrumb: 'Roles'},
                loadComponent: () => import('@domains/dashboard/pages/roles/roles-page/roles-page.component').then(c => c.NzDemoModalBasicComponent),
            },
            {
                path: 'environments-area',
                title: 'Administrar Areas',
                data: {breadcrumb: 'Administrar Areas'},
                loadComponent: () => import('@domains/dashboard/pages/area/area.component').then(c => c.AreaComponent)
            },
            // http://127.0.0.1:4200/dashboard/centres
            {
                path: 'training-centers',
                title: 'Administrar Training Centres',
                data: {breadcrumb: 'Administrar Training Centres'},
                loadComponent: () => import('@domains/dashboard/pages/centre/training-centre-page/training-centre-page.component').then(c => c.TrainingCentrePageComponent)
            },
            {
                path: 'headquarters',
                title: 'Administrar sedes',
                data: {breadcrumb: 'Administrar Sedes '},
                loadComponent: () => import('@domains/dashboard/pages/headquarter/headquarter/headquarter.component').then(c => c.HeadquarterComponent)
            },
            {
                path: 'environments',
                title: 'Administrar Ambientes',
                data: {breadcrumb: 'Administrar Ambientes '},
                loadComponent: () => import('@domains/dashboard/pages/environment/environment.component').then(c => c.EnvironmentComponent)
            },
            {
                path: 'programs',
                title: 'Programas',
                data: {breadcrumb: 'Programas'},
                loadComponent: () => import('@domains/dashboard/pages/programs/progam-page/progam-page.component').then(c => c.ProgamPageComponent)
            },

            {
                path: 'session',
                title: 'session',
                data: {breadcrumb: 'Sesiones'},
                loadComponent: () => import('@domains/dashboard/pages/programs/session-page/session-page.component').then(c => c.SessionPageComponent)
            },

            {
                path: 'course',
                title: 'Cursos',
                data: {breadcrumb: 'Cursos'},
                loadComponent: () => import('@domains/dashboard/pages/programs//course-page/course-page.component').then(c => c.CoursePageComponent)
            },

            {
              path: 'error_401',
              title: 'Autenticación Requerida',
              data: {breadcrumb: '/'},
              loadComponent: () => import('@domains/dashboard/pages/errors/error_401/error-401.component').then(c => c.Error401Component)
          },

          {
            path: 'error_403',
            title: 'Autorización Requerida',
            data: {breadcrumb: '/ '},
            loadComponent: () => import('@domains/dashboard/pages/errors/error-403/error-403.component').then(c => c.Error403Component)
          },

          {
            path: 'error_404',
            title: 'Pagina no Encontrada',
            data: {breadcrumb: '/ '},
            loadComponent: () => import('@domains/dashboard/pages/errors/error-404/error-404.component').then(c => c.Error404Component)
          },

          {
            path: 'error_500',
            title: 'Error de Serividor Interno',
            data: {breadcrumb: '/ '},
            loadComponent: () => import('@domains/dashboard/pages/errors/error-500/error-500.component').then(c => c.Error500Component)
          },

          {
            path: 'error_504',
            title: 'Tiempo de Espera Agotado',
            data: {breadcrumb: '/ '},
            loadComponent: () => import('@domains/dashboard/pages/errors/error-504/error-504.component').then(c => c.Error504Component)
          },
        ]
    }
];
