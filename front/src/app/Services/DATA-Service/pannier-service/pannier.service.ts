import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {CrudComponentService} from "../CRUD-product-service/crud-component.service";
import {data} from "autoprefixer";

@Injectable({
  providedIn: 'root'
})
export class PannierService {
  private storageKey = 'shoppingCart';
  private itemsSubject = new BehaviorSubject<any[]>(this.getItemsFromStorage());
  items$ = this.itemsSubject.asObservable();
  public quantityUpdate: Number | undefined;
  public lastValue : Number | undefined;


  constructor(private productService : CrudComponentService) { }

  private getItemsFromStorage(): any[] {
    const items = localStorage.getItem(this.storageKey);
    return items ? JSON.parse(items) : [];
  }

  updateItems(items: any[]): void {
    this.itemsSubject.next(items);
    localStorage.setItem(this.storageKey, JSON.stringify(items));
  }

  getItems(): any[] {
    return this.itemsSubject.value;
  }



  // AJOUTE UN ITEM AU PANNIER && LE SUPRIMME DU STOCK EN BD
  addItem(item: any): void {
    console.log(this.getItems())
    //SUPRIMME DU STOCK EN BD
    this.productService.decreaseStock(item.id, 1).subscribe(
      (data)=>{

        // AJOUTE L'ITEM AU PANNIER
        const items = this.getItems();
        const index = items.findIndex(i => i.name === item.name);

        if (index !== -1) {

          items[index].quantity += 1;

          if (!items[index].stockId) {
            items[index].stockId = [];
          }

          items[index].stockId.push(data.body[0].id);
          this.updateItems(items);
        } else {
          item.quantity = 1;
          item.stockId = [];
          item.stockId.push(data.body[0].id);
          items.push(item);
          this.updateItems(items);
        }

        console.log(items)
      },
      error => {
        console.log(error)
      }
    )
  }


  // RETIRE UN ITEM DU PANNIER && L'AJOUTE AU STOCK EN BD
  decreaseItemQuantity(item: any): void {
    this.productService.addToStock([item.stockId[0]]).subscribe(
      data => {
      },
      error => {
        console.log(error);
      }
    );

    // RETIRE UN ITEM DU PANNIER
    const items = this.getItems();
    const index = items.findIndex(i => i.name === item.name);
    if (index !== -1) {
      if (items[index].quantity > 1) {
        items[index].quantity -= 1;
        items[index].stockId.splice(0, 1);
      } else {
        items.splice(index, 1);
      }
      this.updateItems(items);
    }
  }


  // RETIRE TOUTE LES QUANTITÉS D'UN ITEMS DU PANNIER && LES AJOUTES AU STOCK EN BD
  removeItem(item: any): void {

    // LES AJOUTES AU STOCK EN BD
    let i = 0;
    const interval = 200;

    const executeWithDelay = () => {
      if (i < item.quantity) {

        this.productService.addToStock([item.stockId[i]]).subscribe(
          data => {
            // Gérer les données ici
            const items = this.getItems();
            const index = items.findIndex(i => i.name === item.name);
            if (index !== -1) {
              items.splice(index, 1);
              this.updateItems(items);
            }
          },
          error => {
            console.log(error);
          }
        );
        i++;
        setTimeout(executeWithDelay, interval);
      }
    };

    executeWithDelay();

  }


  //VIDE L'ENTIERETÉ DU PANNIER ET AJOUTE TOUT LES PRODUITS AU STOCK
  clearCart(): void {
    localStorage.removeItem(this.storageKey);
    this.itemsSubject.next([]);
  }


}
