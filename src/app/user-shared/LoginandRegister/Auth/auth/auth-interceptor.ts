import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const token = localStorage.getItem('auth-token');


  if (token) {
    console.log('🚀 Interceptor: Attaching token to request:', req.url);
    

    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return next(authReq);
  }


  console.warn('⚠️ Interceptor: No token found in Local Storage for:', req.url);
  return next(req);
};