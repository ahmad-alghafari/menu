import { Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { DataRepositoryService } from '../services/data-repository.service';
import { CommonModule } from '@angular/common';
import { ControllerService } from '../services/controller.service';
import { environment } from '../../environments/environment';
import { FormBuilder, FormsModule, NgForm } from '@angular/forms';
import { response } from 'express';
import { Category } from '../shared/category';

@Component({
    selector: 'app-categories',
    imports: [TranslateModule , CommonModule , FormsModule],
    templateUrl: './categories.component.html',
    styleUrl: './categories.component.css'
})
export class CategoriesComponent {

    dataRepository = inject(DataRepositoryService);
    controller = inject(ControllerService);
    categories: { [key: string]: any } = {}; 
    id : string = "";
    category:Category= new Category();
    categorye:Category= new Category();

  
    ngOnInit(): void {
        this.dataRepository.categories$.subscribe(data => {
            this.categories = data;
        });
    }
  
    categoriesKeys() {
        return this.categories && Object.keys(this.categories).length > 0 ? Object.keys(this.categories) : [];
    }

    dalateCategory(id:string){
        this.controller.delete(environment.dataUrl.categories ,id ).subscribe({
            next : () => {
                const categories = this.dataRepository.categories;
                const updatedCategories  = {...categories};
                delete updatedCategories[id];
                this.dataRepository.categories = updatedCategories;
            },
            error : (err) => {
                console.error(err);
            },
        });
    }

    createCategory(form : NgForm){
        if(form.valid){
            const formData = new FormData();
            formData.append('name', this.category.name);
            this.controller.post(environment.dataUrl.categories,formData).subscribe({
                next : (response) => {
                    const categories = this.dataRepository.categories;
                    const updatedCategories = {
                        ...categories,
                        [response.category.id]: { ...response.category }
                    };
                    this.dataRepository.categories = updatedCategories;
                },
                error : (error) => {
                    console.error(error);
                }
            });
        }
    }
    editCategory(form :NgForm ){
        if(form.valid){
            const formData = { "name" : this.categorye.name}
            const id = this.id; //cach value to Avoid mistakes
            this.controller.put(environment.dataUrl.categories,id,formData).subscribe({
                next : (response) => {
                    const categories = this.dataRepository.categories;
                    const updatedCategories = {
                        ...categories,
                        [id]: { ...categories[id], ...response.category }
                    };
                    this.dataRepository.categories = updatedCategories;
                },
                error : (error) => {
                    if (error.status === 422) {
                        console.error('Validation Errors----------------:', error.error.errors);
                    } else {
                        console.error('Unknown Error:', error);
                    }
                }
            });
        }else{
            console.log('edit not valid');
        }
    }

    
}
