import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ControllerService {
   http = inject(HttpClient);

  get(url:string ) : Observable<any> {
    return this.http.get(url).pipe(catchError(this.handleError)); 
  }

  post(url:string , body : any ): Observable<any>{
    return this.http.post(url , body).pipe(catchError(this.handleError)); 
  }

  put(url:string , id :string , body : any ) : Observable<any>{
    return this.http.put(url + '/' + id, body).pipe(catchError(this.handleError)); 
  }
  
  delete(url:string , id : string){
    return this.http.delete(url +'/'+ id).pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    console.error('An error occurred:', error); 
    if (error.error && typeof error.error === 'string') {
      return throwError(() => new Error(error.error));
    } else if (error.message) {
      return throwError(() => new Error(error.message));
    } else {
      return throwError(() => new Error('An unknown error occurred.'));
    }
  }

  timeAgo(inputDate: string | Date): string {
    const parsedDate = new Date(inputDate);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - new Date(inputDate).getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return `since ${diffInSeconds} second${diffInSeconds !== 1 ? 's' : ''} ago`;
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `since ${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `since ${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return `since ${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
    }

    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return `since ${diffInMonths} month${diffInMonths !== 1 ? 's' : ''} ago`;
    }

    const diffInYears = Math.floor(diffInMonths / 12);
    return `since ${diffInYears} year${diffInYears !== 1 ? 's' : ''} ago`;
  }
}
