import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ChangeDetectorRef } from '@angular/core';
import { CrudComponentService } from "../../../Services/DATA-Service/CRUD-product-service/crud-component.service";
import { ActivatedRoute, Router } from "@angular/router";
import { MatFormField } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import {CurrencyPipe, DatePipe, NgClass, NgForOf, NgIf} from "@angular/common";
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatDivider } from "@angular/material/divider";
import {ToastrService} from "ngx-toastr";
import {ErrorHandlerService} from "../../../Services/Error-Handler/error-handler.service";
import {ConfirmationDialogComponent} from "../../dialogs/confirmation-dialog/confirmation-dialog.component";


@Component({
  selector: 'app-product-detail',
  templateUrl: './stock-management.component.html',
  standalone: true,
  imports: [
    MatFormField,
    MatInput,
    ReactiveFormsModule,
    NgIf,
    NgForOf,
    DragDropModule,
    NgClass,
    MatDivider,
    CurrencyPipe,
    DatePipe,
    FormsModule,
  ],
  styleUrls: ['./stock-management.component.css']
})
export class StockManagementComponent implements OnInit {
  productForm: FormGroup;
  productId: string | null | undefined;
  product: any = {};
  showCancelButton: boolean = false;
  subcategories: any[] = [];
  productHistory: any = {};
  editedRow: number | null = null;

  constructor(
    private fb: FormBuilder,
    private CrudComponentService: CrudComponentService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    private errorHandler: ErrorHandlerService,
  ) {
    this.productForm = this.fb.group({
      quantity: [{value: '', disabled: true}, Validators.required],
      addStock: [{value: 0, disabled: true}, Validators.required],
      recommendedRestock: [{value: null, disabled: true}]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.productId = params.get('id');
      if (this.productId) {
        this.loadProduct(this.productId);
        this.loadProductStockHistory(parseInt(this.productId));
      }
    });

    setTimeout(() => {
      this.disable();
    });
  }

  disable() {
    Object.keys(this.productForm.controls).forEach(controlName => {
      this.productForm.controls[controlName].disable();
    });
  }

  enable() {
    Object.keys(this.productForm.controls).forEach(controlName => {
      if (controlName !== 'quantity') {
        this.productForm.controls[controlName].enable();
      }
    });
  }

  loadProduct(id: string) {
    this.CrudComponentService.getComponentById(id).subscribe(
      data => {
        const product = data.body;
        this.product = product;

        console.log(data.body + ": PRODUCT")

        this.productForm.patchValue({
          name: product.name,
          model: product.model,
          manufacturer: product.manufacturer,
          price: product.price,
          description: product.description,
          quantity: product.quantity,
          typeId: product.typeId.id,
          type: product.typeId.name,
          subCategoryId: product.productSubCategory?.id || '',
          subCategory: product.productSubCategory?.name || '',
          weight: product.weight,
          height: product.height,
          width: product.width,
          length: product.length,
          color: product.color,
          created_at: product.created_at,
          addStock: 0,
          recommendedRestock: product.recommended_restock || null,
        });
      },
      error => {
        this.errorHandler.handleError(error, 'Erreur lors du chargement du produit.');
      }
    );
  }

  loadProductStockHistory(productId: number) {
    this.CrudComponentService.getProductStockHistory(productId).subscribe(
      (data: { body: string; }) => {
        this.productHistory = data.body;
        console.log(data.body + ": Data history body");
      },

      (error: string) => {
        console.log("Error fetching product history: " + error);
      }
    )
  }

  redirectToCreateNewDelivery(productId: string | null | undefined) {
    this.router.navigate([`admin-panel/stock/${productId}/add`])
  }

  onEditRow(index: number): void {
    this.editedRow = index;
  }

  onSaveRow(index: number): void {
    const editedHistory = { ...this.productHistory[index], productId: this.productId };

    this.CrudComponentService.updateStockDelivery(editedHistory.id, editedHistory).subscribe(
      response => {
        this.toastr.success('Stock edité avec succès!');
        this.editedRow = null;
      },
      error => {
        this.errorHandler.handleError(error, 'Error updating stock');
      }
    );
  }

  onCancelEdit(): void {
    this.editedRow = null;
  }

  onDeleteRow(index: number): void {
    const stockToDelete = this.productHistory[index];
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      height: '220px',
      data: {
        title: 'Confirmation de suppression',
        message: 'Êtes-vous sûr de vouloir supprimer cette entrée en stock ?',
        confirmButtonText: 'Oui, supprimer',
        cancelButtonText: 'Annuler'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.CrudComponentService.deleteStockDelivery(stockToDelete.id).subscribe(
          response => {
            this.toastr.success('Stock supprimé avec succès!');
            this.productHistory.splice(index, 1);
          },
          error => {
            this.errorHandler.handleError(error, 'Erreur lors de la suppression du stock');
          }
        );
      }
    })
  }
}
