import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path:'',
        loadComponent:()=>import('@domains/dashboard/dashboard-layout/dashboard-layout.component').then(c=>c.DashboardLayoutComponent),
        children:[
            {
                path:'',
                pathMatch:'full',
                redirectTo:'login',
            },
            {
                path:'roles',
                title:'Administrar roles',
                loadComponent:()=>import('@domains/dashboard/pages/roles/roles-page/roles-page.component').then(c=>c.RolesPageComponent)
            },
            {
                path:'environments-area',
                title:'Administrar Areas',
                loadComponent:()=>import('@domains/dashboard/pages/area/area.component').then(c=>c.AreaComponent)
            },
            // http://127.0.0.1:4200/dashboard/centres
            {
                path:'training-centers',
                title:'Administrar Training Centres',
                loadComponent:()=>import('@domains/dashboard/pages/centre/training-centre-page/training-centre-page.component').then(c=>c.TrainingCentrePageComponent)
            },
            {
                path:'headquarters',
                title:'Administrar sedes',
                loadComponent:()=>import('@domains/dashboard/pages/headquarter/headquarter/headquarter.component').then(c=>c.HeadquarterComponent)
            },
            {
                path:'environments',
                title:'Administrar Ambientes',
                loadComponent:()=>import('@domains/dashboard/pages/environment/environment.component').then(c=>c.EnvironmentComponent)
            }
        ]
    }
];
