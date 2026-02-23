import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // 1. Get the token using the exact key found in your Local Storage
  const token = localStorage.getItem('auth-token');

  // 2. Debugging: This will show you in the console if the token is being picked up
  if (token) {
    console.log('🚀 Interceptor: Attaching token to request:', req.url);
    
    // 3. Clone the request and add the Authorization header
    // Ensure there is a SPACE after 'Bearer'
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return next(authReq);
  }

  // 4. If no token, just let the request pass through (e.g., for login/register)
  console.warn('⚠️ Interceptor: No token found in Local Storage for:', req.url);
  return next(req);
};