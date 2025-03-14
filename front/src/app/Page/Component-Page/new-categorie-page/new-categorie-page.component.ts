import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import { CrudComponentService } from "../../../Services/DATA-Service/CRUD-product-service/crud-component.service";
import { Router } from "@angular/router";
import { NgForOf, NgIf, NgStyle } from "@angular/common";
import { MatInput } from "@angular/material/input";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-new-categorie-page',
  standalone: true,
  imports: [
    NgForOf,
    ReactiveFormsModule,
    MatInput,
    NgStyle,
    NgIf
  ],
  templateUrl: './new-categorie-page.component.html',
  styleUrls: ['./new-categorie-page.component.css']
})
export class NewCategoriePageComponent {
  productForm: FormGroup;
  preview: { name: string; picture: string | ArrayBuffer | null } | null = null;

  constructor(
    private fb: FormBuilder,
    private crudComponentService: CrudComponentService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      picture: [null, Validators.required]
    });

    this.productForm.valueChanges.subscribe(val => {
      this.updatePreview();
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.convertFileToBase64(file).then((base64: string | ArrayBuffer) => {
        this.productForm.patchValue({
          picture: base64
        });
        this.updatePreview();
      });
    }
  }

  async createCategorie() {
    if (!this.productForm.valid) {
      this.toastr.error('Formulaire invalide. Veuillez vérifier les champs.');
      return;
    }

    const { name, picture } = this.productForm.value;

    const data = {
      name: name,
      picture: picture
    };

    this.crudComponentService.createComponentType(data).subscribe(
      () => {
        this.toastr.success("Categorie créé avec succès !");
        this.router.navigate(['/admin-panel/categories']);
      },
      error => {
        let errorMessage = 'Erreur lors de la création de la catégorie. Veuillez réessayer.';

        if (error.status === 400) {
          errorMessage = 'Veuillez vérifier les données envoyées.';
        } else if (error.status === 401) {
          errorMessage = 'Vous n\'êtes pas autorisé à effectuer cette action. Veuillez vous connecter.';
        } else if (error.status === 404) {
          errorMessage = 'Le serveur n\'a pas pu trouver la ressource demandée.';
        } else if (error.status === 409) {
          errorMessage = 'Une catégorie avec ce nom existe déjà.';
        } else if (error.status === 500) {
          errorMessage = 'Erreur interne du serveur. Veuillez réessayer plus tard.';
        }

        this.toastr.error(errorMessage, '', {
          closeButton: false,
          disableTimeOut: undefined,
          easeTime: undefined,
          easing: "",
          enableHtml: false,
          extendedTimeOut: 0,
          messageClass: "",
          newestOnTop: false,
          onActivateTick: false,
          payload: undefined,
          positionClass: "",
          progressAnimation: undefined,
          progressBar: false,
          tapToDismiss: false,
          timeOut: 0,
          titleClass: "",
          toastClass: "",
          toastComponent: undefined,
        });
        console.error('Error creating category', error);
      }
    );
  }

  private convertFileToBase64(file: File): Promise<string | ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result as string | ArrayBuffer);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  private updatePreview() {
    this.preview = {
      name: this.productForm.get('name')?.value,
      picture: this.productForm.get('picture')?.value
    };
  }
}
