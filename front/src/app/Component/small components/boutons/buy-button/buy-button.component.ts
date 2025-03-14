import { Component, Input } from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {PannierService} from "../../../../Services/DATA-Service/pannier-service/pannier.service";
import {AnimationServiceService} from "../../../../Services/DATA-Service/animation-service/animation-service.service";
import {CrudComponentService} from "../../../../Services/DATA-Service/CRUD-product-service/crud-component.service";

@Component({
  selector: 'app-buy-button',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './buy-button.component.html',
  styleUrl: './buy-button.component.css'
})
export class BuyButtonComponent {
  @Input() productDate: any;
  product = {
    id: 0,
    name: '',
    description: '',
    manufacturer: '',
    model: '',
    price: 0,
    quantity: 0,
    type: '',
    mainImage: '',
    specifications: {},
    additionalImages: [],
    variants: [] as { id: number; color: string }[],
    color:"",
    weight:0,
    width:0,
    height:0,
    length:0
  };
  constructor(private pannierService: PannierService, private router: Router,private crudProductService: CrudComponentService,) { }


  addToCart() {

      if(typeof this.productDate === "number"){
        this.crudProductService.getComponentById(this.productDate).subscribe(
          data=>{
            this.assignProductData(data.body)
          },
          error => {
            console.log(error)
          }
        )
      }else{
        const productCopy = { ...this.productDate, quantity: 1 };
        this.pannierService.addItem(productCopy);
        this.router.navigate(['/panier'])
      }

  }

  assignProductData(data: any) {

    this.product.id = data.id;
    this.product.name = data.name;
    this.product.description = data.description;
    this.product.manufacturer = data.manufacturer;
    this.product.model = data.model;
    this.product.price = data.price;
    this.product.quantity = data.quantity;
    this.product.type = data.typeId.name;
    this.product.specifications = this.parseSpecifications(data.specifications);
    this.product.mainImage = data.files[0].file;
    this.product.additionalImages = data.files.map((fileObj: { file: any; }) => fileObj.file);
    this.product.variants = data.variants as { id: number; color: string }[];
    this.product.color=data.color;
    this.product.weight=data.weight;
    this.product.length=data.length;
    this.product.width=data.width;
    this.product.height=data.height;
    const productCopy = { ...this.product, quantity: 1 };
    this.pannierService.addItem(productCopy);
    this.router.navigate(['/panier'])
  }

  parseSpecifications(input: string) {
    let dataString = input.trim();
    if (dataString.startsWith('{') && dataString.endsWith('}')) {
      dataString = dataString.substring(1, dataString.length - 1).trim();
    }

    dataString = dataString.replace(/([\w\séèàùêëïîçûâô]+):/g, (match, p1) => {
      return `"${p1.trim()}":`;
    });

    dataString = dataString.replace(/:\s*([^,}]+)/g, (match, p1) => {
      return `: "${p1.trim()}"`;
    });

    dataString = dataString.replace(/"\s*"([^"]+)"\s*"/g, '"$1"');

    dataString = `{${dataString}}`;
    try {
      return JSON.parse(dataString);
    } catch (error) {
      console.error('Error parsing specifications:', error);
      return {};
    }
  }
}
