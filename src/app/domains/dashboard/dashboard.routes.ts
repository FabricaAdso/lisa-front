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
                path:'areas',
                title:'Administrar Areas',
                loadComponent:()=>import('@domains/dashboard/pages/area/area-page/area-page.component').then(c=>c.AreaPageComponent)
            },
            // http://127.0.0.1:4200/dashboard/centres
            {
                path:'trainingCenters',
                title:'Administrar Training Centres',
                loadComponent:()=>import('@domains/dashboard/pages/centre/training-centre-page/training-centre-page.component').then(c=>c.TrainingCentrePageComponent)
            },
            {
                path:'headquarters',
                title:'Administrar sedes',
                loadComponent:()=>import('@domains/dashboard/pages/headquarter/headquarter/headquarter.component').then(c=>c.HeadquarterComponent)
            }
        ]
    }
];
