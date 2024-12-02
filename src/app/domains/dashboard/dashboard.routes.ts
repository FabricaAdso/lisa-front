import { Routes } from '@angular/router';
import { authGuard } from '../../guards/auth.guard';

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
        data: { breadcrumb: 'Roles ' },
        canActivate: [authGuard],
        loadComponent: () => import('@domains/dashboard/pages/roles/roles-page/roles-page.component').then(c => c.RolesComponent),
      },

      {
        path: 'justificatios',
        title: 'Administrar Asistencias',
        data: { breadcrumb: '' },
        canActivate: [authGuard],
        loadComponent: () => import('@domains/dashboard/pages/justification-apprentice/justification-apprentice.component').then(c => c.JustificationApprenticeComponent)
      },

      {
        path: 'environments-area',
        title: 'Administrar Areas',
        data: { breadcrumb: 'Administrar Areas' },
        canActivate: [authGuard],
        loadComponent: () => import('@domains/dashboard/pages/area/area.component').then(c => c.AreaComponent)
      },

      {
        path: 'training-centers',
        title: 'Administrar Centros de Formación',
        data: { breadcrumb: 'Administrar Centros de Formación' },
        canActivate: [authGuard],
        loadComponent: () => import('@domains/dashboard/pages/centre/training-centre-page/training-centre-page.component').then(c => c.TrainingCentrePageComponent)
      },

      {
        path: 'headquarters',
        title: 'Administrar sedes',
        data: { breadcrumb: 'Administrar Sedes ' },
        canActivate: [authGuard],
        loadComponent: () => import('@domains/dashboard/pages/headquarter/headquarter/headquarter.component').then(c => c.HeadquarterComponent)
      },

      {
        path: 'environments',
        title: 'Administrar Ambientes',
        data: { breadcrumb: 'Administrar Ambientes ' },
        canActivate: [authGuard],
        loadComponent: () => import('@domains/dashboard/pages/environment/environment.component').then(c => c.EnvironmentComponent)
      },

      {
        path: 'programs',
        title: 'Programas',
        data: { breadcrumb: 'Programas' },
        canActivate: [authGuard],
        loadComponent: () => import('@domains/dashboard/pages/programs/progam-page/progam-page.component').then(c => c.ProgamPageComponent)
      },

      {
        path: 'session',
        title: 'session',
        data: { breadcrumb: 'Sesiones' },
        canActivate: [authGuard],
        loadComponent: () => import('@domains/dashboard/pages/programs/session-page/session-page.component').then(c => c.SessionPageComponent)
      },

      {
        path: 'course',
        title: 'Cursos',
        data: { breadcrumb: 'Cursos' },
        canActivate: [authGuard],
        loadComponent: () => import('@domains/dashboard/pages/programs//course-page/course-page.component').then(c => c.CoursePageComponent)
      },

      {
        path: 'calendar',
        title: 'Sesiónes',
        data: { breadcrumb: 'Sesiónes' },
        canActivate: [authGuard],
        loadComponent: () => import('@domains/dashboard/pages/calendar/calendar.component').then(c => c.CalendarComponent)
      },

      {
        path: 'error_401',
        title: 'Autenticación Requerida',
        loadComponent: () => import('@domains/dashboard/pages/errors/error_401/error-401.component').then(c => c.Error401Component)
      },
      {
        path: 'error_500',
        title: 'Error de Servidor',
        loadComponent: () => import('@domains/dashboard/pages/errors/error-500/error-500.component').then(c => c.Error500Component)
      },

      //Tiene que ir de ultimo, por alguna razón xD
      {
        path: '**',
        title: 'Página no encontrada',
        loadComponent: () => import('@domains/dashboard/pages/errors/error-404/error-404.component').then(c => c.Error404Component)
      },
    ]
  }
];
