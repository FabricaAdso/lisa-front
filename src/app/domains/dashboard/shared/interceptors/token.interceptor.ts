import { HttpHeaders, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenServiceTsService } from '../services/token.service.ts.service';


export const tokenInterceptor: HttpInterceptorFn = (req, next) => {

  const token_service = inject(TokenServiceTsService);

  if(!token_service.getToken()) return next(req);

  let auth_headers = new HttpHeaders();

  req = req.clone({
    headers: auth_headers.set(
      'authorization',
      token_service.getToken()!
    )
  });


  return next(req);
};
