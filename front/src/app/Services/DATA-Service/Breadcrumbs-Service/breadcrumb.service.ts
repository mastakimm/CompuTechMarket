import {Injectable, OnInit} from '@angular/core';
import { Observable, of } from 'rxjs';
import {CrudComponentService} from "../CRUD-product-service/crud-component.service";

@Injectable({
  providedIn: 'root'
})
export class CategoryService{
  private categories: { id: string, name: string }[] = [];
  private products: { id: string, name: string, categoryId: string }[] = [];


  constructor(private CrudComponentService: CrudComponentService) {

    this.CrudComponentService.getAllComponents().subscribe(
      data=>{
        this.products = data.body.map((product: any) => ({
          id: product.id,
          name: product.name,
          categoryId: product.categoryId
        }));
      },
      error=>{
        console.log(error)
      }
    )

    this.CrudComponentService.getAllComponentsType().subscribe(
      data=>{
        this.categories = data.body.map((category: any) => ({
          id: category.id,
          name: category.name
        }));
      },
      error=>{
        console.log(error)
      }
    )
  }

  getCategoryNameById(id: string | null): Observable<string> {
    const category = this.categories.find(cat => cat.id.toString() === id);
    return of(category ? category.name : 'Toute catégorie');
  }

  getProductNameById(id: string): Observable<string> {
    const product = this.products.find(prod => prod.id.toString() === id);
    return of(product ? product.name : 'Produit inconnu');
  }
}
