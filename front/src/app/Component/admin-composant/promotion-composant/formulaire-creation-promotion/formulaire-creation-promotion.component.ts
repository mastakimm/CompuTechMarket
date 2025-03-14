import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CrudComponentService } from '../../../../Services/DATA-Service/CRUD-product-service/crud-component.service';
import { PromotionService } from '../../../../Services/DATA-Service/promotion/promotion.service';
import { ActivatedRoute, Router } from '@angular/router';
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-formulaire-creation-promotion',
  templateUrl: './formulaire-creation-promotion.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgForOf,
    NgIf,
    NgClass
  ],
  styleUrls: ['./formulaire-creation-promotion.component.css']
})
export class FormulaireCreationPromotionComponent implements OnInit {
  public productForm: FormGroup;
  public productId: string | null = "";
  public promotionId: string | null | undefined;
  public promotion: string | null = "";
  searchResults: any[] = [];
  public selectedProducts :any[] = [];
  public newProductsValue :any[] = [];

  public product = {
    name: '',
    price: 0,
  };

  public newPrice: string = "";

  constructor(
    private fb: FormBuilder,
    private crudService: CrudComponentService,
    private route: ActivatedRoute,
    private promotionService: PromotionService,
    private router: Router,
    private toastr: ToastrService,
  ) {
    // Initialisation du FormGroup avec les nouveaux champs
    this.productForm = this.fb.group({
      promotion: ['', [Validators.required]],
      started_at: ['', [Validators.required]],
      end_at: ['', [Validators.required]],
      model: [{ value: '', disabled: true }],
      stock: ['', [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.productId = params.get('id');
    });

    if (this.productId) {
      this.promotionService.getProductPromotionWithProductId(this.productId).subscribe(
        data => {

          if (data.body && data.body.length > 0) {
            const product = data.body[0];
            this.product = product;
            this.newPrice = this.product.price.toString();

            if (product.promotions && product.promotions.length > 0) {
              const promotion = product.promotions[0];
              this.promotionId = promotion.productId;

              this.productForm.patchValue({
                promotion: promotion.promotion,
                started_at: new Date(promotion.started_at).toISOString().substring(0, 16),
                end_at: new Date(promotion.end_at).toISOString().substring(0, 16),
                stock: promotion.stock
              });
            }

            this.clickOnProduct(product);
          }
        },
        error => {
          console.log(error);
        }
      );
    }

    this.productForm.get('promotion')?.valueChanges.subscribe(value => {
      this.setNewPrice();
    });
  }


  setNewPrice() {


    const promotionValue = this.productForm.get('promotion')?.value;
    if(!promotionValue){
      this.newProductsValue = this.selectedProducts.map(selectedProduct => ({ ...selectedProduct }));
    }

    for(let i = 0; i < this.selectedProducts.length; i++) {
      this.newProductsValue[i].price = this.promotionService.setNewPrice( this.newProductsValue[i], promotionValue);

    }
  }

  submitForm() {
    if (this.productForm.valid) {
      const formData = this.productForm.value;
      const formattedStartedAt = new Date(formData.started_at).toISOString();
      const formattedEndAt = new Date(formData.end_at).toISOString();

      this.newProductsValue.forEach(newProductValue => {
        const promotionData = {
          productId: newProductValue.id,
          promotion: formData.promotion,
          started_at: formattedStartedAt,
          end_at: formattedEndAt,
          stock: formData.stock
        };

        this.promotionService.getProductPromotionWithProductId(newProductValue.id).subscribe(
          data => {
            const productData = data.body[0];
            if (productData && productData.promotions && productData.promotions.length > 0) {
              this.promotionService.updatePromotion(promotionData.productId, promotionData).subscribe(
                response => {
                  this.toastr.success('Promotion mise à jour avec succès !')
                  this.router.navigate([`/admin-panel/promotion`]);
                },
                error => {
                  console.error('Error updating promotion', error);
                }
              );
            } else {
              this.promotionService.createComponent(promotionData).subscribe(
                response => {
                  this.toastr.success('Promotion créée avec succès !')
                  this.router.navigate([`/admin-panel/promotion`]);
                },
                error => {
                  console.error('Error creating promotion', error);
                }
              );
            }
          },
          error => {
            console.log(error);
          }
        );
      });
    }
  }


  searchByName(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const inputValue = inputElement.value;

    if (inputValue) {
      this.crudService.getComponentByName(inputValue).subscribe(
        data => {
          this.searchResults = data.body;
        },
        error => {
          console.error('Error retrieving product:', error);
        }
      );
    } else {
      this.searchResults = [];
    }
  }

  clickOnProduct(product: any) {
    this.selectedProducts.push(product);
    this.newProductsValue = this.selectedProducts.map(selectedProduct => ({ ...selectedProduct }));

    this.searchResults = [];
  }


}
