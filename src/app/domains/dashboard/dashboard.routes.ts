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
            }
        ]
    }
];
