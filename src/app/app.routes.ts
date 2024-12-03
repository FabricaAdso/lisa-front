import { Routes } from '@angular/router';
import { LoginPageComponent } from '@domains/pages/login-page/login-page.component';
import { PasswordResetComponent } from '@domains/pages/password-reset/password-reset.component';

export const routes: Routes = [
    {
        path:'',
        pathMatch:'full',
        redirectTo:'dashboard'
    },
    {
        path:'auth',
        loadChildren:()=>import('@domains/auth/auth.routes').then(r=>r.routes)
    },
    {
        path:'dashboard',
        loadChildren:()=>import('@domains/dashboard/dashboard.routes').then(r=>r.routes)
    },
    {
        path: 'password/reset/:token',
        title: 'Reset password',
        loadComponent: () => import('@domains/pages/password-reset/password-reset.component').then(c => c.PasswordResetComponent)
    }
];
