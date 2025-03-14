import {Component, Input} from '@angular/core';
import {CommonModule} from "@angular/common";
import {Router, RouterModule} from '@angular/router';
import {CrudComponentService} from "../../../../Services/DATA-Service/CRUD-product-service/crud-component.service";
import {ActualCatogireService} from "../../../../Services/DATA-Service/Breadcrumbs-Service/actual-catogire.service";

@Component({
  selector: 'app-product-detail-button',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-detail-button.component.html',
  styleUrl: './product-detail-button.component.css'
})
export class ProductDetailButtonComponent {
@Input() id: number = 0;

public typeName : string="";

constructor(private productService : CrudComponentService, private actualCategorie : ActualCatogireService,private router: Router) {
}
  redirectArticle(){

    this.productService.getComponentById(this.id.toString()).subscribe(
      data=>{
        this.typeName =data.body.typeId.id
        this.actualCategorie.setActualCategorie(data.body.typeId.name)

        this.router.navigate([`categorie/${this.typeName}`, this.id])
      },
      error => {
        console.log(error)
      }
    )

  }

}
