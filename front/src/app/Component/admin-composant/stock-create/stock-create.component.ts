import {Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {CurrencyPipe, NgForOf, NgIf} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import { MatInput } from "@angular/material/input";
import {ToastrService} from "ngx-toastr";
import {ErrorHandlerService} from "../../../Services/Error-Handler/error-handler.service";
import {CrudComponentService} from "../../../Services/DATA-Service/CRUD-product-service/crud-component.service";

@Component({
  selector: 'app-create-stock-create',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgForOf,
    MatInput,
    NgIf,
    CurrencyPipe
  ],
  templateUrl: './stock-create.component.html',
  styleUrls: ['./stock-create.component.css']
})
export class StockCreateComponent implements OnInit{
  stockForm: FormGroup;
  public errorMsg: string = "";
  productId: string | null | undefined;
  product: any | null | undefined;

  constructor(
    private fb: FormBuilder,
    private CrudProductService: CrudComponentService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private errorHandler: ErrorHandlerService,
  ) {
    this.stockForm = this.fb.group({
      supplier: ['', Validators.required],
      quantity: ['', Validators.required],
      refillDate: [new Date(), Validators.required],
      purchasePrice: ['', Validators.required],
      sellingPrice: ['', Validators.required],
      productId: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.productId = params.get('id');
      if (this.productId) {
        this.loadProductByProductId(this.productId);
      }
    })
  }

  createStock() {
    const { supplier, quantity, refillDate, purchasePrice, sellingPrice } = this.stockForm.value;

    const data = {
      quantity: quantity,
      supplier: supplier,
      refillDate: refillDate || new Date(),
      purchasePrice: purchasePrice,
      sellingPrice: sellingPrice,
      productId: this.productId,
    };

    this.CrudProductService.createNewStockDelivery(data).subscribe(
      (response: any) => {
        this.router.navigate([`/admin-panel/${this.productId}/stock`]);
        this.toastr.success('Livraison ajoutée avec succès !')
      },
      (error: any) => {
        this.errorHandler.handleError(error, 'Erreur lors de l\'ajout en stock.');

        console.error('Error adding stock', error);
      }
    );
  }

  loadProductByProductId(productId: string) {
    this.CrudProductService.getComponentById(productId).subscribe(
      (response: any) => {
        this.product = response.body;
        console.log(response.body);

        // TODO
    }
    )
  }

}
