import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, shareReplay, take } from 'rxjs';
import { ControllerService } from './controller.service';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class DataRepositoryService {
  controller = inject(ControllerService);

  //categories
  categoriesSubject = new BehaviorSubject<{ [key: string]: any }>({});
  categories$ = this.categoriesSubject.asObservable().pipe(shareReplay(1));
  get categories() {return this.categoriesSubject.getValue();}
  set categories(value: { [key: string]: any }) {this.categoriesSubject.next(value);}
  //dishes
  dishesSubject = new BehaviorSubject<{[key:string]:any}>({});
  dishes$ = this.dishesSubject.asObservable().pipe(shareReplay(1));
  get dishes(){return this.dishesSubject.getValue();}
  set dishes(value: { [key: string]: any }) {this.dishesSubject.next(value);}
  //orders
  ordersSubject = new BehaviorSubject<{[key:string]:any}>({});
  orders$ = this.ordersSubject.asObservable().pipe(shareReplay(1));
  get orders() {return this.ordersSubject.getValue();}
  set orders(value: { [key: string]: any }) {this.ordersSubject.next(value);}
  //qrcode
  qrcodeSubject = new BehaviorSubject<{[key:string]:any}>({});
  qrcode$ = this.qrcodeSubject.asObservable().pipe(shareReplay(1));
  get qrcode() {return this.qrcodeSubject.getValue();}
  set qrcode(value: { [key: string]: any }) {this.qrcodeSubject.next(value);}

  initializeData() : void {
    this.controller.get(environment.dataUrl.categories).pipe(take(1)).subscribe({
      next : response => {
        this.categoriesSubject.next(response.categories);
        console.table(response.categories);
      } , error : error =>{
        console.error('Error fetching categories : ', error);
      }
    });
    this.controller.get(environment.dataUrl.dishesUrl).pipe(take(1)).subscribe({
      next : response => {
        this.dishesSubject.next(response.dishes);
        console.table(response.dishes);
      } , error : error =>{
        console.error('Error fetching dishes : ', error);
      }
    });
    this.controller.get(environment.dataUrl.ordersUrl).pipe(take(1)).subscribe({
      next : response => {
        this.ordersSubject.next(response.orders);
        console.table(response.orders);
      } , error : error =>{
        console.error('Error fetching orders : ', error);
      }
    });
    this.controller.get(environment.dataUrl.qrcodeUrl).pipe(take(1)).subscribe({
      next : response => {
        this.qrcodeSubject.next(response.QRcodes);
        console.table(response.QRcodes);
      } , error : error =>{
        console.error('Error fetching QRcodes : ', error);
      }
    });
  }
}
