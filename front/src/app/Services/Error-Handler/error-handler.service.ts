import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor(private toastr: ToastrService) { }

  handleError(error: any, customMessage?: string): void {
    let errorMessage = customMessage || 'Erreur lors de l\'opération. Veuillez réessayer.';

    if (error && error.status) {
      switch (error.status) {
        case 400:
          errorMessage = 'Requête invalide. Veuillez vérifier les données envoyées.';
          break;
        case 401:
          errorMessage = 'Non autorisé. Veuillez vous connecter.';
          break;
        case 403:
          errorMessage = 'Accès refusé. Vous n\'avez pas les permissions nécessaires.';
          break;
        case 404:
          errorMessage = 'Ressource non trouvée. Veuillez vérifier l\'ID de la catégorie.';
          break;
        case 500:
          errorMessage = 'Données incorrectes ou manquantes. Vérifier les caractéristiques.';
          break;
        default:
          errorMessage = `Erreur inattendue (code: ${error.status}). Veuillez réessayer.`;
      }
    }

    this.toastr.error(errorMessage);
  }
}
