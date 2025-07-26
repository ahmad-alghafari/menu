import { Component, inject, Input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ControllerService } from '../services/controller.service';
import { environment } from '../../environments/environment.prod';

@Component({
  selector: 'app-dishes-user',
  imports: [],
  templateUrl: './dishes-user.component.html',
  styleUrl: './dishes-user.component.css'
})
export class DishesUserComponent {

  router = inject(Router);
  dishes = {};
  categories = {};
  resturant_name = "";
  controller = inject(ControllerService);

  @Input() set name(name: string) {
    if (name) {
      this.controller.get(environment.dataUrl.resturantUrl + '/' + name).subscribe({
        next : response => {
          console.table(response);
          this.dishes = response.dishes;
          this.categories = response.categories;
          this.resturant_name = response.resturant_name;
        } , error : error => {
          console.error(error);
          console.error('Restuarant Not Found!');
          this.router.navigate(['/notfound']);
        }
      });
    } else {
      console.error('Restuarant Not Found!');
      this.router.navigate(['/notfound']);
    }
  }

}
