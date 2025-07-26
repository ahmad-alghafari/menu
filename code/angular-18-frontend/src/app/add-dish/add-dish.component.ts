import { CommonModule, NgFor } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { DataRepositoryService } from '../services/data-repository.service';
import { ControllerService } from '../services/controller.service';
import { FormsModule, NgForm } from '@angular/forms';
import { Dish } from '../shared/dishe';
import { environment } from '../../environments/environment';

@Component({
    selector: 'app-add-dish',
    imports: [TranslateModule , CommonModule ,FormsModule ],
    templateUrl: './add-dish.component.html',
    styleUrl: './add-dish.component.css'
})
export class AddDishComponent {

    dataRepository = inject(DataRepositoryService);
    controller = inject(ControllerService);
    categories: { [key: string]: any } = {}; 
    dish : Dish = new Dish();
    fd : FormData = new FormData() ;


    ngOnInit(): void {
        this.dataRepository.categories$.subscribe(data => {
            this.categories = data;
        });
    }
  
    categoriesKeys() {
        return this.categories && Object.keys(this.categories).length > 0 ? Object.keys(this.categories) : [];
    }

    createDish(form : NgForm){
        if(form.valid){
            this.fd.set("name",this.dish.name);
            this.fd.set("description",this.dish.description);
            this.fd.set("price",this.dish.price.toString());
            this.fd.set("category_id",this.dish.category_id);
            this.controller.post(environment.dataUrl.dishesUrl , this.fd).subscribe({
                next :  (response) =>{
                    this.dish = new Dish();
                    this.fd = new FormData();
                    const dishes = this.dataRepository.dishes;
                    const updateDishes = {
                        ...dishes , 
                        [response.dish.id] : { ...response.dish }
                    };
                    this.dataRepository.dishes = updateDishes;
                },
                error : (error) => {
                    console.error(error);
                }
            })
        }
    }

    uploadNewFile(event : any){
        var file = event.target.files[0];
        this.fd.set('file',file,file.name);
    }
}
