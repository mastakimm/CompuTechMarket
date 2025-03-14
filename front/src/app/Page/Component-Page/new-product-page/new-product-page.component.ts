import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { CrudComponentService } from "../../../Services/DATA-Service/CRUD-product-service/crud-component.service";
import { NgForOf, NgIf } from "@angular/common";
import { Router } from "@angular/router";
import { MatFormField } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { MatDivider } from "@angular/material/divider";
import {ToastrService} from "ngx-toastr";
import {ErrorHandlerService} from "../../../Services/Error-Handler/error-handler.service";

@Component({
  selector: 'app-new-product-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgForOf,
    MatFormField,
    MatInput,
    NgIf,
    MatDivider
  ],
  templateUrl: './new-product-page.component.html',
  styleUrls: ['./new-product-page.component.css']
})
export class NewProductPageComponent implements OnInit {
  productForm: FormGroup;
  selectedFiles: string[] = [];
  allComponentTypes: any[] = [];
  subcategories: any[] = [];
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private crudComponentService: CrudComponentService,
    private router: Router,
    private cd: ChangeDetectorRef,
    private toastr: ToastrService,
    private errorHandler: ErrorHandlerService,
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      model: ['', Validators.required],
      manufacturer: ['', Validators.required],
      price: ['', Validators.required],
      pictures: this.fb.array([]),
      description: ['', Validators.required],
      specifications: this.fb.array([
        this.fb.group({
          title: '',
          value: ''
        })
      ]),
      typeId: ['', Validators.required],
      subCategoryId: [{ value: '', disabled: true }, Validators.required],
      weight: ['', Validators.required],
      height: ['', Validators.required],
      width: ['', Validators.required],
      length: ['', Validators.required],
      color: ['#000000', [Validators.required, Validators.pattern(/^#[0-9A-Fa-f]{6}$/)]]
    });
  }

  ngOnInit(): void {
    this.crudComponentService.getAllComponentsType().subscribe(
      types => {
        this.allComponentTypes = types.body || [];
      },
      error => {
        this.errorHandler.handleError(error, 'Erreur lors du chargement des types de composants.');
      }
    );
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
    this.pictures.clear();
    this.selectedFiles = [];

    for (let file of files) {
      this.pictures.push(this.fb.control(file));
      this.selectedFiles.push(file.name);
    }
  }

  removeFile(index: number) {
    this.pictures.removeAt(index);
    this.selectedFiles.splice(index, 1);
  }

  triggerColorPicker() {
    const colorInput = document.getElementById('product_color') as HTMLInputElement;
    colorInput.click();
  }

  updateColor(event: Event) {
    const input = event.target as HTMLInputElement;
    const colorValue = input.value;
    this.productForm.patchValue({ color: colorValue });
  }

  onCategoryChange(event: any) {
    const selectedCategoryId = event.target.value;
    this.subcategories = [];

    if (selectedCategoryId) {
      this.crudComponentService.getCategorySubCategories(selectedCategoryId).subscribe(
        (data: any) => {
          this.subcategories = data.body || [];
          this.productForm.get('subCategoryId')?.enable();
        },
        error => {
          this.errorHandler.handleError(error, 'Erreur lors de la récupération des sous-catégories.');
          this.productForm.get('subCategoryId')?.disable();
        }
      );
    } else {
      this.productForm.get('subCategoryId')?.disable();
    }
  }

  loadLastProduct() {
    this.crudComponentService.getLastAddedProduct().subscribe(
      (product: any) => {
        console.log('Product data:', product.body);

        this.productForm.patchValue({
          name: product.body.name || '',
          model: product.body.model || '',
          manufacturer: product.body.manufacturer || '',
          price: product.body.price || '',
          description: product.body.description || '',
          typeId: product.body.typeId?.id || '',
          weight: product.body.weight || '',
          height: product.body.height || '',
          width: product.body.width || '',
          length: product.body.length || '',
          color: product.body.color || '#000000'
        });

        const specificationsArray = this.productForm.get('specifications') as FormArray;
        specificationsArray.clear();

        const specificationsText = product.body.specifications || '';
        const specs = specificationsText.split(',').map((spec: string) => {
          const [title, value] = spec.split(':').map(s => s.trim());
          return {title, value};
        });

        specs.forEach((spec: any) => {
          specificationsArray.push(this.fb.group({
            title: spec.title || '',
            value: spec.value || ''
          }));
        });

        console.log('Parsed Specifications:', specs);

        const typeId = product.body.typeId?.id;
        if (typeId) {
          this.crudComponentService.getCategorySubCategories(typeId).subscribe(
            (data: any) => {
              this.subcategories = data.body || [];
              this.productForm.get('subCategoryId')?.enable();
              this.productForm.patchValue({
                subCategoryId: product.body.productSubCategory?.id || '',
              });
            },
            error => {
              console.error('Error fetching subcategories', error);
              this.productForm.get('subCategoryId')?.disable();
            }
          );
        }

        this.cd.detectChanges();
      },
      error => {
        console.error('Error loading last product:', error);
      }
    );
  }

  createComponent() {
    const {
      name,
      model,
      manufacturer,
      price,
      description,
      specifications,
      typeId,
      subCategoryId,
      weight,
      height,
      width,
      length,
      color
    } = this.productForm.value;

    if (!this.productForm.valid) {
      this.toastr.error('Formulaire invalide. Veuillez vérifier les champs.');
      return;
    }

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
        subCategoryId: subCategoryId,
        weight: weight,
        height: height,
        width: width,
        length: length,
        color: color
      };

      this.crudComponentService.createComponent(data).subscribe(
        (response: any) => {
          this.toastr.success("Produit créé avec succès !");
          this.router.navigate(['/admin-panel/products']);
        },
        (error: any) => {
          this.errorHandler.handleError(error, 'Erreur lors de la création du produit.');
          console.error('Error adding product', error);
        }
      );
    }).catch(error => {
      this.toastr.error('Erreur lors du téléchargement des images. Veuillez réessayer.');
      console.error('Error converting files to base64', error);
    });
  }

  private convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}
