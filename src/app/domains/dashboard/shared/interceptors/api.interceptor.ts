import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '@env/environment.development';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {

  const { API_URL } = environment;

  req = req.clone({
    url: `${API_URL}/${req.url}`
  });


  return next(req);

  



};
