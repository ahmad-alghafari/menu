import { Component, Inject, inject, Input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ControllerService } from '../services/controller.service';
import { environment } from '../../environments/environment.prod';
import { routeNames } from '../app.routes';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject, shareReplay } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dishes-user',
  imports: [TranslateModule , CommonModule],
  templateUrl: './dishes-user.component.html',
  styleUrl: './dishes-user.component.css'
})
export class DishesUserComponent {

  router = inject(Router);
  // dishes = {};
  // categories = {};
  resturant_name = "";
  controller = inject(ControllerService);

   //categories
    categoriesSubject = new BehaviorSubject<{ [key: string]: any }>({});
    categories$ = this.categoriesSubject.asObservable().pipe(shareReplay(1));
    get categories() {return this.categoriesSubject.getValue();}
    set categories(value: { [key: string]: any }) {this.categoriesSubject.next(value);}
    categoriesKeys() {
      return this.categories && Object.keys(this.categories).length > 0 ? Object.keys(this.categories) : [];
    }
    //dishes
    dishesSubject = new BehaviorSubject<{[key:string]:any}>({});
    dishes$ = this.dishesSubject.asObservable().pipe(shareReplay(1));
    get dishes(){return this.dishesSubject.getValue();}
    set dishes(value: { [key: string]: any }) {this.dishesSubject.next(value);}
    dishesKeys() {
      return this.dishes && Object.keys(this.dishes).length > 0 ? Object.keys(this.dishes) : [];
    }


  @Input() set name(id: string) {
    if (id) {
      this.controller.get(environment.dataUrl.resturantUrl + '/' + id).subscribe({
        next : response => {
          console.table(response);
          this.categoriesSubject.next(response.categories);
          this.dishesSubject.next(response.dishes);
          // this.dishes = response.dishes;
          // this.categories = response.categories;
          this.resturant_name = response.resturant_name;
        } , error : error => {
          console.error(error);

          if (error.status === 404) {
            console.error('Restaurant Not Found!');
            this.router.navigate([routeNames.notFound]);
          } else if (error.status === 503) {
            this.router.navigate(['/seless' ,routeNames.serviceUnavailable]);
            console.error('Restaurant Service Unavailable!');
          } else{
            this.router.navigate([routeNames.notFound]);
          }
        }
      });
    } else {
      console.error('URL  Of QRcode Is Wrong ');
      this.router.navigate([routeNames.notFound]);
    }
  }

}
