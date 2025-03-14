import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ChangeDetectorRef } from '@angular/core';
import { CrudComponentService } from "../../../Services/DATA-Service/CRUD-product-service/crud-component.service";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { MatFormField } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { NgClass, NgForOf, NgIf } from "@angular/common";
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatDivider } from "@angular/material/divider";
import {ToastrService} from "ngx-toastr";
import {ErrorHandlerService} from "../../../Services/Error-Handler/error-handler.service";
import {ConfirmationDialogComponent} from "../../dialogs/confirmation-dialog/confirmation-dialog.component";
import {MatSnackBarModule} from "@angular/material/snack-bar";

@Component({
  selector: 'app-product-detail',
  templateUrl: './component-detail.component.html',
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
    MatSnackBarModule,
    RouterLink
  ],
  styleUrls: ['./component-detail.component.css']
})
export class ComponentDetailComponent implements OnInit {
  productForm: FormGroup;
  selectedFiles: string[] = [];
  productId: string | null | undefined;
  showCancelButton: boolean = false;
  allComponentTypes: any[] = [];
  subcategories: any[] = [];

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
      name: [{ value: '', disabled: true }, Validators.required],
      model: [{ value: '', disabled: true }, Validators.required],
      manufacturer: [{ value: '', disabled: true }, Validators.required],
      price: [{ value: '', disabled: true }, Validators.required],
      pictures: this.fb.array([]),
      description: [{ value: '', disabled: true }, Validators.required],
      specifications: this.fb.array([
        this.fb.group({
          title: [{ value: '', disabled: true }],
          value: [{ value: '', disabled: true }]
        })
      ]),
      addStock: [{ value: 0, disabled: true }, Validators.required],
      typeId: [{ value: '', disabled: true }, Validators.required],
      type: [{ value: '', disabled: true }, Validators.required],
      subCategoryId: [{ value: '', disabled: true }, Validators.required],
      subCategory: [{ value: '', disabled: true }, Validators.required],
      weight: [{ value: '', disabled: true }, Validators.required],
      height: [{ value: '', disabled: true }, Validators.required],
      width: [{ value: '', disabled: true }, Validators.required],
      length: [{ value: '', disabled: true }, Validators.required],
      color: [{ value: '', disabled: true }, [Validators.required, Validators.pattern(/^#[0-9A-Fa-f]{6}$/)]],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.productId = params.get('id');
      if (this.productId) {
        this.loadProduct(this.productId);
      }
    });

    setTimeout(() => {
      this.disable();
    });

    this.CrudComponentService.getAllComponentsType().subscribe(
      types => {
        this.allComponentTypes = types.body || [];
      },
      error => {
        console.log(error)
      }
    );
  }

  disable() {
    Object.keys(this.productForm.controls).forEach(controlName => {
      this.productForm.controls[controlName].disable();
    });
  }

  enable() {
    this.specifications.controls.forEach(control => {
      control.get('title')?.enable();
      control.get('value')?.enable();
    });
  }

  get specifications() {
    return this.productForm.get('specifications') as FormArray;
  }

  get pictures() {
    return this.productForm.get('pictures') as FormArray;
  }

  addSpecification() {
    this.specifications.push(this.fb.group({
      title: '',
      value: ''
    }));
  }

  onFileChange(event: any) {
    const files = event.target.files;

    for (let file of files) {
      this.pictures.push(this.fb.control(file));
      this.convertFileToBase64(file).then(base64 => {
        this.selectedFiles.push(base64);
      });
    }
  }

  onCategoryChange(event: any) {
    const selectedCategoryId = event.target.value;
    this.subcategories = [];

    if (selectedCategoryId) {
      this.CrudComponentService.getCategorySubCategories(selectedCategoryId).subscribe(
        (data: any) => {
          this.subcategories = data.body || [];

          const subCategoryId = this.productForm.get('subCategoryId')?.value;
          if (subCategoryId) {
            this.productForm.patchValue({ subCategoryId: subCategoryId });
          } else {
            this.productForm.get('subCategoryId')?.setValue('');
          }
        },
        error => {
          console.error('Error fetching subcategories', error);
          this.productForm.get('subCategoryId')?.disable();
        }
      );
    } else {
      this.productForm.get('subCategoryId')?.disable();
    }
  }

  loadProduct(id: string) {
    this.CrudComponentService.getComponentById(id).subscribe(
      data => {
        const product = data.body;

        this.productForm.patchValue({
          name: product.name,
          model: product.model,
          manufacturer: product.manufacturer,
          price: product.price,
          description: product.description,
          typeId: product.typeId.id,
          type: product.typeId.name,
          subCategoryId: product.productSubCategory?.id || '',
          subCategory: product.productSubCategory?.name || '',
          weight: product.weight,
          height: product.height,
          width: product.width,
          length: product.length,
          color: product.color,
        });

        this.onCategoryChange({ target: { value: product.typeId.id } });

        this.specifications.clear();
        product.specifications.split(', ').forEach((spec: string) => {
          const [title, value] = spec.split(': ');
          this.specifications.push(this.fb.group({
            title: [{ value: title, disabled: true }],
            value: [{ value: value, disabled: true }]
          }));
        });

        this.pictures.clear();
        this.selectedFiles = product.files.map((file: any) => file.file);
        product.files.forEach((file: any) => {
          this.pictures.push(this.fb.control(file.file));
        });

        this.disableSpecifications();
      },
      error => {
        this.errorHandler.handleError(error, 'Erreur lors du chargement du produit.');
      }
    );
  }


  toggleUpdateButton(show: boolean) {
    const updateButton = document.getElementById('edit-btn');
    if (updateButton) {
      if (show) {
        updateButton.classList.remove('hidden');
      } else {
        updateButton.classList.add('hidden');
      }
    }
  }

  toggleButtonVisibility(className: string, show: boolean) {
    const buttons = document.getElementsByClassName(className);
    for (let i = 0; i < buttons.length; i++) {
      const button = buttons[i];
      if (show) {
        button.classList.remove('hidden');
        button.classList.add('flex');
      } else {
        button.classList.remove('flex');
        button.classList.add('hidden');
      }
    }
  }

  onEditClickUnlock() {
    this.showCancelButton = true;
    this.enable();
    this.toggleUpdateButton(true);
    this.toggleButtonVisibility('delete-img-btn', true);
    this.toggleButtonVisibility('add-spec-btn', true);

    this.cdr.markForCheck();
  }

  triggerColorPicker() {
    const colorInput = document.getElementById('product_color') as HTMLInputElement;
    colorInput.click();
  }

  onCancelEdit() {
    this.showCancelButton = false;
    this.disable();
    this.toggleUpdateButton(false);
    this.toggleButtonVisibility('delete-img-btn', false);
    this.toggleButtonVisibility('add-spec-btn', false);

    this.cdr.markForCheck();
  }

  updateColor(event: Event) {
    const input = event.target as HTMLInputElement;
    const colorValue = input.value;
    this.productForm.patchValue({ color: colorValue });
  }

  updateComponent() {
    const {
      name,
      model,
      manufacturer,
      price,
      description,
      specifications,
      typeId,
      weight,
      height,
      width,
      length,
      subCategoryId,
      color
    } = this.productForm.value;

    const specs = specifications.map((spec: any) => `${spec.title}: ${spec.value}`).join(', ');

    const picturePromises = this.pictures.controls.map((control: any) => this.convertFileToBase64(control.value));

    Promise.all(picturePromises).then(base64Pictures => {
      const data = {
        name: name,
        model: model,
        manufacturer: manufacturer,
        price: price,
        picture: base64Pictures,
        description: description,
        specifications: specs,
        typeId: typeId,
        weight: weight,
        height: height,
        width: width,
        length: length,
        subCategoryId: subCategoryId,
        color: color
      };

      this.CrudComponentService.updateComponent(this.productId, data).subscribe(
        response => {
          this.toastr.success('Produit mis à jour avec succès.')
          this.router.navigate(['admin-panel/stock'])
        },
        error => {
          this.errorHandler.handleError(error, 'Erreur lors de la mise à jour du produit.');
        }
      );
    }).catch(error => {
      this.errorHandler.handleError(error, 'Erreur lors de la conversion des fichiers.');
    });
  }

  disableSpecifications() {
    this.specifications.controls.forEach(control => {
      control.get('title')?.disable();
      control.get('value')?.disable();
    });
  }

  private convertFileToBase64(file: File | string): Promise<string> {
    return new Promise((resolve, reject) => {
      if (typeof file === 'string' && file.startsWith('data:')) {
        resolve(file);
      } else if (file instanceof File) {
        const reader = new FileReader();
        reader.onload = () => {
          resolve(reader.result as string);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      } else {
        reject('Invalid file type');
      }
    });
  }

  removeFile(index: number) {
    this.pictures.removeAt(index);
    this.selectedFiles.splice(index, 1);
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.selectedFiles, event.previousIndex, event.currentIndex);
    const picturesArray = this.productForm.get('pictures') as FormArray;
    const movedControl = picturesArray.at(event.previousIndex);
    picturesArray.removeAt(event.previousIndex);
    picturesArray.insert(event.currentIndex, movedControl);
  }

  deleteComponent() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '',
      data: {
        title: 'Confirmation de suppression',
        message: 'Êtes-vous sûr de vouloir supprimer ce produit ?',
        confirmButtonText: 'Oui, supprimer',
        cancelButtonText: 'Annuler'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.CrudComponentService.deleteComponent(this.productId).subscribe(
          data => {
            this.router.navigate(['/admin-panel/component']);
            this.toastr.success('Produit supprimé avec succès!')
          },
          error => {
            this.errorHandler.handleError(error, 'Erreur lors de la suppression du produit.');
          }
        );
      }
    });
  }

  gotoPromoForm(){
    this.router.navigate([`/admin-panel/promotion/create/${this.productId}`]);
  }

}
