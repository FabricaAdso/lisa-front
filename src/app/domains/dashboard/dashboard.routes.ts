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
                loadComponent: () => import('@domains/dashboard/pages/roles/roles-page/roles-page.component').then(c => c.RolesComponent)
            },
            {
                path:'environmentsArea',
                title:'Administrar Areas',
                loadComponent:()=>import('@domains/dashboard/pages/area/area.component').then(c=>c.AreaComponent)
            },
            // http://127.0.0.1:4200/dashboard/centres
            {
                path:'trainingCenters',
                title:'Administrar Training Centres',
                loadComponent:()=>import('@domains/dashboard/pages/centre/training-centre-page/training-centre-page.component').then(c=>c.TrainingCentrePageComponent)
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
              loadComponent: () => import('@domains/dashboard/pages/errors/error_401/error-401.component').then(c => c.Error401Component)
            },
            {
              path: 'error_500',
              title: 'Error de Servidor',
              loadComponent: () => import('@domains/dashboard/pages/errors/error-500/error-500.component').then(c => c.Error500Component)
            },

            //No se porque pero cuando la puse sobre el error 500 se ejecutaba el 404
            {
              path: '**',
              title: 'Página no encontrada',
              loadComponent: () => import('@domains/dashboard/pages/errors/error-404/error-404.component').then(c => c.Error404Component)
            },

        ]
    }
];
