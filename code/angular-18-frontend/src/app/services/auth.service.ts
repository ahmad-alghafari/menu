import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, Observable, of, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { DataRepositoryService } from './data-repository.service';
import { routeNames } from '../app.routes';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();
  
  constructor(
    private http: HttpClient, 
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem("token");
        if (token) {
          this.isLoggedInSubject.next(true);
        }
    }
  }

  login(credentials: any): void {
    this.http.post<any>(environment.authUrl.loginUrl, credentials).subscribe({
      next: (response) => {
        const token = response.token;
        console.log("response token" + token);
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('token', token);
          // console.log("set token correct : " + token);
        }
        this.isLoggedInSubject.next(true);
        this.router.navigate(['/admin',routeNames.dashboard]);
      },
      error: (error) => {
        // console.log("res error");
        this.handleError<any>('login')(error).subscribe(); 
      },
    });
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
        const token = localStorage.getItem("token");
        if (token) {
            const headers = new HttpHeaders({
                'Authorization': `Bearer ${token}`
            });

            this.http.post<any>(environment.authUrl.logoutUrl, {}, { headers: headers }).subscribe({
                next: (response) => {
                    localStorage.removeItem('token');
                    this.isLoggedInSubject.next(false);
                    this.router.navigate(['auth/login']);
                },
                error: (error) => {
                    console.error("Logout failed:", error);
                },
            });
        }else{
          this.isLoggedInSubject.next(false);
          this.router.navigate(['auth/login']);
        }
    }
  }

  // checkTokenValidity(): void {
  //   if (isPlatformBrowser(this.platformId)) { // التحقق من بيئة المتصفح
  //     const token = localStorage.getItem('token');
  //     if (token) {
  //       this.http.get(`${this.apiUrl}/verify-token`, { headers: { Authorization: `Bearer ${token}` } }).pipe(
  //         tap(() => this.isLoggedInSubject.next(true)),
  //         catchError(() => {
  //           localStorage.removeItem('token');
  //           this.isLoggedInSubject.next(false);
  //           return of(null);
  //         })
  //       ).subscribe();
  //     } else {
  //       this.router.navigate(['auth/login']); 
  //       this.isLoggedInSubject.next(false);
  //     }
  //   } else {
  //     this.isLoggedInSubject.next(false);
  //   }
  // }
  // checkTokenValidity(): void {
  //   if (isPlatformBrowser(this.platformId)) { // التحقق من بيئة المتصفح
  //     const token = localStorage.getItem('token');
  //     if (token) {
  //       this.http.get(`${this.apiUrl}/verify-token`, { headers: { Authorization: `Bearer ${token}` } }).subscribe({
  //         next: (response) => {
  //           this.isLoggedInSubject.next(true);
  //           console.log("verify good");
  //         },error : (error) =>{
  //           console.error(error);
  //           console.log("verifyy bad");

  //           localStorage.removeItem('token');
  //           this.isLoggedInSubject.next(false);
  //           this.router.navigate(['auth/login']); 
  //         }
  //       });
  //     }
  //   }
  // }

  isLoggedIn(): boolean {
    return this.isLoggedInSubject.value;
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token');
    }
    return null;
  }

  resetSision(){
    if (isPlatformBrowser(this.platformId)) {
      this.isLoggedInSubject.next(false);
      localStorage.removeItem('token');
    }
  }
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
