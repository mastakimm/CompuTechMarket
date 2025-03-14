import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import { CrudComponentService } from "../../../Services/DATA-Service/CRUD-product-service/crud-component.service";
import {ActivatedRoute, Router} from "@angular/router";
import {NgForOf, NgIf, NgStyle} from "@angular/common";
import { MatInput } from "@angular/material/input";
import {ToastrService} from "ngx-toastr";
import {ErrorHandlerService} from "../../../Services/Error-Handler/error-handler.service";

@Component({
  selector: 'app-sub-category-create',
  standalone: true,
  imports: [
    NgForOf,
    ReactiveFormsModule,
    MatInput,
    NgStyle,
    NgIf
  ],
  templateUrl: './sub-category-create.component.html',
  styleUrls: ['./sub-category-create.component.css']
})
export class SubCategoryCreateComponent {
  parentCategoryId: number | null = null;
  productForm: FormGroup;
  preview: { nom: string; picture: string | ArrayBuffer | null } | null = null;

  constructor(
    private fb: FormBuilder,
    private CrudComponentService: CrudComponentService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private errorHandler: ErrorHandlerService,
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.parentCategoryId = parseInt(<string>this.route.snapshot.paramMap.get('id'));
  }

  async createSubCategorie() {
    const { name } = this.productForm.value;

    const data = {
      name: name,
      parentCategoryId: this.parentCategoryId
    };

    this.CrudComponentService.createProductSubCategory(data).subscribe(
      data => {
        this.router.navigate([`/admin-panel/categories/${this.parentCategoryId}`]);
        this.toastr.success('Sous-categorie crée avec succès!')
      },
      error => {
        this.errorHandler.handleError(error, 'Erreur de lors de la création de la sous-categorie.')

        console.error('Error creating category', error);
      }
    );
  }
}
