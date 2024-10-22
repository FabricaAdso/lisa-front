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
                path:'programs',
                title:'Programas',
                loadComponent:()=>import('@domains/dashboard/pages/programs/progam-page/progam-page.component').then(c=>c.ProgamPageComponent)
            },

            {
                path:'session',
                title:'session',
                loadComponent:()=>import('@domains/dashboard/pages/programs/session-page/session-page.component').then(c=>c.SessionPageComponent)
            },

            {
                path:'course',
                title:'course',
                loadComponent:()=>import('@domains/dashboard/pages/programs//course-page/course-page.component').then(c=>c.CoursePageComponent)
            }
        ]
    }
];
