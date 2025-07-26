import { Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { DataRepositoryService } from '../services/data-repository.service';
import { CommonModule, CurrencyPipe, NgFor } from '@angular/common';
import { ControllerService } from '../services/controller.service';
import { environment } from '../../environments/environment';
import { FormsModule, NgForm } from '@angular/forms';
import { Dish } from '../shared/dishe';
import { Editdish } from '../shared/editdish';

@Component({
    selector: 'app-dishes',
    imports: [TranslateModule , NgFor , CurrencyPipe , CommonModule , FormsModule],
    templateUrl: './dishes.component.html',
    styleUrl: './dishes.component.css'
})
export class DishesComponent {
    dataRepository = inject(DataRepositoryService);
    controller = inject(ControllerService);
    
    dishes: { [key: string]: any } = {}; 
    categories: { [key: string]: any } = {}; 

    editForm : Editdish = new Editdish();
    fd : FormData = new FormData() ;
    idDelete :string = '';
    id :string = '';


    ngOnInit(): void {
        this.dataRepository.dishes$.subscribe(data => {
            this.dishes = data;
        });
        this.dataRepository.categories$.subscribe(data => {
            this.categories = data;
        });
    }

    get dishesCount(): number {
        return Object.keys(this.dishes).length;
    }

    get availablefoodCount(): number {
        return Object.values(this.dishes).filter(dish => dish.availability === 'available').length;
    }
    
    dishesKeys() {
        return this.dishes && Object.keys(this.dishes).length > 0 ? Object.keys(this.dishes) : [];
    }

    categoriesKeys() {
        return this.categories && Object.keys(this.categories).length > 0 ? Object.keys(this.categories) : [];
    }

    changStatus(id : string){
        const newValue = this.dishes[id].availability == 'available' ? 'not_available' : 'available';
        this.controller.put(environment.dataUrl.dishesUrl+'/status',id,{'status':newValue}).subscribe({
            next : () => {
                this.dishes[id].availability = newValue;
            },
            error(error) {
                console.error(error);
            },
        });
    }

    uploadNewFile(event : any){
        var file = event.target.files[0];
        this.fd.set('file',file,file.name);
    }


    setDish(id : string){
        this.editForm.id = id;
        this.editForm.name = this.dishes[id].name;
        this.editForm.description = this.dishes[id].description;
        this.editForm.path = this.dishes[id].path;
        this.editForm.price = this.dishes[id].price;
        this.editForm.category_id = this.dishes[id].category_id;
    }

    edit(form : NgForm){
        if(form.valid){
            const cach = this.editForm ;
            this.fd.set('id' , this.editForm.id);
            this.fd.set('name' , this.editForm.name);
            this.fd.set('description' , this.editForm.description);
            this.fd.set('path' , this.editForm.path);
            this.fd.set('price' , this.editForm.price.toString());
            this.fd.set('category_id' , this.editForm.category_id);

            this.controller.post(environment.dataUrl.dishesUrl+"/edit" , this.fd).subscribe({
                next : (response) => {
                    const dishes = this.dataRepository.dishes;
                    const updatedDishes = {
                        ...dishes ,
                        [cach.id]:{...dishes[cach.id] , ...response.dish}
                    }
                    this.dataRepository.dishes = updatedDishes;
                },
                error : (error) => {
                    console.error(error);
                    console.error(error.errors.e);

                }
            });
        }
    }

    delete(){
        if(this.idDelete != ""){
            const tempId = this.idDelete;
            this.controller.delete(environment.dataUrl.dishesUrl , tempId).subscribe({
                next:  () => {
                    const dishes = this.dataRepository.dishes;
                    const newDishes = {...dishes};
                    delete newDishes[tempId];
                    this.dataRepository.dishes = newDishes;
                },
                error : (err) => {
                    console.error(err);
                },
            });
        }
    }
}
