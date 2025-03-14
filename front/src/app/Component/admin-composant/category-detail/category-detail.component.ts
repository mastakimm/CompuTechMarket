import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule} from '@angular/forms';
import { CrudComponentService } from '../../../Services/DATA-Service/CRUD-product-service/crud-component.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryData } from '../../../Interface/category.interface';
import { ProductData } from "../../../Interface/product.interface";
import { MatButtonModule } from "@angular/material/button";
import { AdminSearchBarProductComponent } from "../admin-search-bar-product/admin-search-bar-product.component";
import { NgClass, NgForOf, NgIf, NgStyle } from "@angular/common";
import {MatDivider} from "@angular/material/divider";
import {count} from "rxjs";
import {ToastrService} from "ngx-toastr";
import { ErrorHandlerService } from '../../../Services/Error-Handler/error-handler.service';
import {MatDialog} from "@angular/material/dialog";
import {ConfirmationDialogComponent} from "../../dialogs/confirmation-dialog/confirmation-dialog.component";

@Component({
  selector: 'app-category-detail',
  standalone: true,
  imports: [
    MatButtonModule,
    AdminSearchBarProductComponent,
    NgStyle,
    NgForOf,
    NgIf,
    NgClass,
    ReactiveFormsModule,
    FormsModule,
    MatDivider,
  ],
  templateUrl: './category-detail.component.html',
  styleUrls: ['./category-detail.component.css']
})
export class CategoryDetailsComponent implements OnInit {
  dataSource: CategoryData[] = [];
  products: ProductData[] = [];
  categoryId: number | undefined;
  categoryName: string | undefined;
  selectedSubCategoryId: number | null = null;
  editFormVisible = false;
  editCategoryMode = false;
  subCategoryForm: FormGroup;
  imagePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;

  constructor(
    private crudComponentService: CrudComponentService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private errorHandler: ErrorHandlerService,
  ) {
    this.subCategoryForm = this.fb.group({
      id: [null],
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]]
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.categoryId = +params.get('id')!;
      this.fetchCategoryName();
    });

    this.crudComponentService.getCategorySubCategories(this.categoryId).subscribe(
      data => {
        this.dataSource = data.body.map((subCategory: any) => ({
          id: subCategory.id,
          name: subCategory.name
        }));
      },
      error => {
        this.errorHandler.handleError(error, 'Erreur du chargement des sous-catégories.');
      }
    );
  }

  redirectNewSubCategorie(id: number | undefined) {
    this.router.navigate([`/admin-panel/categories/${id}/sub-categories/create`]);
  }

  fetchCategoryName() {
    if (this.categoryId) {
      this.crudComponentService.getCategoryById(this.categoryId).subscribe(
        data => {
          this.categoryName = data.body.name;
        },
        error => {
          console.error('Error fetching category name', error);
        }
      );
    }
  }

  saveCategoryName(): void {
    if (this.categoryName && this.categoryId) {
      const updatedCategory: any = {
        id: this.categoryId,
        name: this.categoryName,
      };

      if (this.selectedFile) {
        const reader = new FileReader();
        reader.onload = () => {
          updatedCategory.picture = reader.result as string;
          this.updateCategory(updatedCategory);
        };
        reader.readAsDataURL(this.selectedFile);
      } else {
        this.updateCategory(updatedCategory);
      }
    }
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }

  toggleEditCategoryMode(): void {
    this.editCategoryMode = !this.editCategoryMode;
  }

  updateCategory(updatedCategory: any): void {
    this.crudComponentService.updateCategory(this.categoryId!, updatedCategory).subscribe(
      response => {
        this.editCategoryMode = false;

        this.toastr.success('Catégorie mise à jour avec succès !');
      },
      error => {
        this.errorHandler.handleError(error, 'Erreur lors de l\'édtion de la categorie. Veuillez réessayer.');

        console.error('Error updating category', error);
      }
    );
  }

  deleteCategory(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirmation de suppression',
        message: 'Êtes-vous sûr de vouloir supprimer cette catégorie ?',
        confirmButtonText: 'Oui, supprimer',
        cancelButtonText: 'Annuler'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.crudComponentService.deleteCategory(this.categoryId!).subscribe(
          response => {
            this.router.navigate(['/admin-panel/categories']);

            this.toastr.success('Catégorie supprimée avec succès!');
          },
          error => {
            this.errorHandler.handleError(error, 'Erreur lors de la suppression de la catégorie. Veuillez réessayer.')
            console.error('Error deleting category', error);
          }
        );
      }
    });
  }

  editSubCategory(subCategory: CategoryData): void {
    this.subCategoryForm.patchValue({
      id: subCategory.id,
      name: subCategory.name
    });
    this.editFormVisible = true;
  }

  deleteSubCategory(subCategoryId: number, event: MouseEvent): void {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this sub-category?')) {
      this.crudComponentService.deleteSubCategory(subCategoryId).subscribe(
        response => {
          this.dataSource = this.dataSource.filter(cat => cat.id !== subCategoryId);
          if (this.selectedSubCategoryId === subCategoryId) {
            this.selectedSubCategoryId = null;
            this.products = [];
          }
          this.toastr.success('Sous-catégorie supprimée avec succès!', 'Success',);
        },
        error => {
          this.errorHandler.handleError(error, 'Error deleting sub-category');
        }
      );
    }
  }

  onSubmit(): void {
    if (this.subCategoryForm.valid) {
      const formData = this.subCategoryForm.value
      const updatedSubCategory = {
        ...formData,
        parentCategoryId: this.categoryId
      };

      this.crudComponentService.updateSubCategory(updatedSubCategory.id, updatedSubCategory).subscribe(
        response => {
          const index = this.dataSource.findIndex(cat => cat.id === updatedSubCategory.id);
          if (index !== -1) {
            this.dataSource[index] = updatedSubCategory;
          }
          this.editFormVisible = false;
          this.toastr.success('Sous-catégorie mise à jour avec succès !');
        },
        error => {
          this.errorHandler.handleError(error, 'Erreur lors de la création du produit. Veuillez réessayer.');
        }
      );
    }
  }

  protected readonly count = count;
}
