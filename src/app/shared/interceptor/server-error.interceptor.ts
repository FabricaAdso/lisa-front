import { inject, Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

export const serverErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Manejo de error de conexión (status 0)
      if (error.status === 0) {
        router.navigate(['/dashboard','error_500'], {
          queryParams: {
            message: 'No se puede conectar con el servidor',
            details: 'El servidor está apagado o no es accesible'
          }
        });
        return throwError(() => error);
      }

      if (error.status === 500) {
        router.navigate(['/dashboard','error_500'], {
          queryParams: {
            message: error.error?.message || 'Error interno del servidor',
            details: JSON.stringify(error.error)
          }
        });
      }

      return throwError(() => error);
    })
  );
};
