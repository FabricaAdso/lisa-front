import { Routes } from '@angular/router';
import { PasswordResetComponent } from '@domains/pages/password-reset/password-reset.component';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('@domains/auth/auth-layout/auth-layout.component').then(
        (c) => c.AuthLayoutComponent
      ),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login',
      },
      {
        path: 'login',
        title: 'Iniciar Sesión',
        loadComponent: () =>
          import('@domains/pages/login-page/login-page.component').then(
            (c) => c.LoginPageComponent
          ),
      },
      {
        path: 'register',
        title: 'Registrate',
        loadComponent: () =>
          import(
            '@domains/pages/register-page/register-page.component'
          ).then((c) => c.RegisterPageComponent),
      },
      // {
      //   path: 'password-reset',
      //   title: 'password-reset',
      //   loadComponent: () => import('@domains/pages/password-reset/password-reset.component')
      //   .then(c => c.PasswordResetComponent)
      // }
      { path: 'password/reset/:token', component: PasswordResetComponent },
    ],
  },
];
