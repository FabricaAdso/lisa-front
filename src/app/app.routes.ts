import { Routes } from '@angular/router';
import { LoginPageComponent } from '@domains/pages/login-page/login-page.component';

export const routes: Routes = [
    {
        path:'',
        pathMatch:'full',
        redirectTo:'auth'
    },
    {
        path:'auth',
        loadChildren:()=>import('@domains/auth/auth.routes').then(r=>r.routes)
    }
];
