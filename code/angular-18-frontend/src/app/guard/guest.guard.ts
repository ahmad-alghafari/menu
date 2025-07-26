import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const guestGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
    if(authService.isLoggedIn()){
      return false;
    }else{
    console.log("guest guard check -> result : " + authService.isLoggedInSubject.value );
      return true;
    }
};
