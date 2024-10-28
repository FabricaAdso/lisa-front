import { Routes } from '@angular/router';
import { LoginPageComponent } from '@domains/pages/login-page/login-page.component';

export const routes: Routes = [
    {
        path:'',
        pathMatch:'full',
        redirectTo:'Dash'
    },
    {
        path:'auth',
        loadChildren:()=>import('@domains/auth/auth.routes').then(r=>r.routes)
    },
    {
        path:'Dash',
        loadChildren:()=>import('@domains/dashboard/dashboard.routes').then(r=>r.routes)
    }
];
