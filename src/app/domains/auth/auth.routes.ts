import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path:'',
        loadComponent:()=>import('@domains/auth/auth-layout/auth-layout.component').then(c=>c.AuthLayoutComponent),
        children:[
            {
                path:'',
                pathMatch:'full',
                redirectTo:'login',
            },
            {
                path:'login',
                title:'Iniciar Sesión',
                loadComponent:()=>import('@domains/auth/pages/login-page/login-page.component').then(c=>c.LoginPageComponent)
            }
        ]
    }
];
