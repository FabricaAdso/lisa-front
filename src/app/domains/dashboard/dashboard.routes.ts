import { Routes } from '@angular/router';
import { NzDemoModalBasicComponent } from '@domains/dashboard/pages/roles/roles-page/roles-page.component';

export const routes: Routes = [
    {
        path:'',
        loadComponent:()=>import('@domains/dashboard/dashboard-layout/dashboard-layout.component').then(c=>c.DashboardLayoutComponent),
        children:[
            {
                path:'',
                pathMatch:'full',
                redirectTo:'roles',
            },
            {
                path:'roles',
                title:'Administrar roles',
                loadComponent:()=>import('@domains/dashboard/pages/roles/roles-page/roles-page.component').then(c=>c.NzDemoModalBasicComponent)
            }
        ]
    }
];
