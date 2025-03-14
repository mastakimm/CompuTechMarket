import { Routes } from '@angular/router';
import {MainPageComponent} from "./Page/main-page/main-page.component";
import {AdminPageComponent} from "./Page/admin-page/admin-page.component";
import {OtpFormPageComponent} from "./Page/otp-form-page/otp-form-page.component";
import {DetailProductPageComponent} from "./Page/Component-Page/detail-product-page/detail-product-page.component";
import {AccueilPageComponent} from "./Page/Component-Page/accueil-page/accueil-page.component";
import {UserDetailComponent} from "./Component/admin-composant/user-detail/user-detail.component";
import {UserOrderDetailComponent} from "./Component/admin-composant/user-order-detail/user-order-detail.component";
import {UserDisplayComponent} from "./Component/admin-composant/user-display/user-display.component";
import {FormLogComponent} from "./Component/form-log/form-log.component";
import {CategoryComponent} from "./Component/category/category.component";
import {ResetPasswordPageComponent} from "./Page/reset-password-page/reset-password-page.component";
import {ComponentDisplayComponent} from "./Component/admin-composant/product-display/component-display.component";
import {ComponentDetailComponent} from "./Component/admin-composant/product-detail/component-detail.component";
import {NewProductPageComponent} from "./Page/Component-Page/new-product-page/new-product-page.component";
import {CatergoryFilterComponent} from "./Component/catergory-filter/catergory-filter.component";
import {NewCategoriePageComponent} from "./Page/Component-Page/new-categorie-page/new-categorie-page.component";
import { AllCategoriePageComponent } from './Component/admin-composant/category-display/all-categorie-page.component';
import {PanierPageComponent} from "./Component/panier-page/panier-page.component";
import {UserCreateComponent} from "./Component/admin-composant/user-create/user-create.component";
import {CategoryDetailsComponent} from "./Component/admin-composant/category-detail/category-detail.component";
import {SubCategoryCreateComponent} from "./Component/admin-composant/sub-category-create/sub-category-create.component";
import {StockDisplay} from "./Component/admin-composant/stock-display/stock-display";
import {StockManagementComponent} from "./Component/admin-composant/stock-management/stock-management.component";
import {UserProfilPageComponent} from "./Page/Component-Page/user-profil-page/user-profil-page.component";
import {PaiementPageComponent} from "./Page/paiement-page/paiement-page.component";
import {
  FormulaireCreationPromotionComponent
} from "./Component/admin-composant/promotion-composant/formulaire-creation-promotion/formulaire-creation-promotion.component";
import {
  ListProductPromotionComponent
} from "./Component/admin-composant/promotion-composant/list-product-promotion/list-product-promotion.component";

import {HistoricPageComponent} from "./Page/Component-Page/historic-page/historic-page.component";
import {PaiementModePageComponent} from "./Page/Component-Page/paiement-mode-page/paiement-mode-page.component";
import {
  DeliveryFeeManagementComponent
} from "./Component/admin-composant/delivery-fee-management/delivery-fee-management.component";
import {
  DeliverableCountryCreateComponent
} from "./Component/admin-composant/deliverable-country-create/deliverable-country-create.component";
import {InformationCommandePageComponent} from "./Page/information-commande-page/information-commande-page.component";
import {UserNewAddress} from "./Component/customerAddress/createAddress/createAddress.component";
import {UserUpdateAddress} from "./Component/customerAddress/updateAddress/updateAddress.component";
import {StockCreateComponent} from "./Component/admin-composant/stock-create/stock-create.component";
import {
  PaymentMethodsManagementComponent
} from "./Component/admin-composant/payment-methods/payment-methods-management/payment-methods-management.component";
import {CguComponent} from "./Page/cgu/cgu.component";
import {PromotionPageComponent} from "./Page/promotion-page/promotion-page.component";
import {SousCategoryPageComponent} from "./Component/sous-category-page/sous-category-page.component";
import {SuiviLivraisonComponent} from "./Page/Component-Page/suivi-livraison/suivi-livraison.component";

export const routes: Routes = [
  {
    path: '',
    component: MainPageComponent,
    data: { breadcrumb: '' },
    children: [
      {
        path: '',
        component: AccueilPageComponent,
        data: { breadcrumb: 'Accueil' }
      },
      {
        path: 'categorie',
        component: CategoryComponent,
        data: { breadcrumb: 'Catégorie' }
      },
      {
        path: 'categorie/:categoryId',
        component: CatergoryFilterComponent,
        data: { breadcrumb: '' }
      },
      {
        path: 'categorie/:categoryId/:productId',
        component: DetailProductPageComponent,
        data: { breadcrumb: '' }
      },
      {
        path: 'categorie/sous-categorie/:sousCategoryName/:sousCategoryId',
        component: SousCategoryPageComponent,
        data: { breadcrumb: '' }
      },
      {
        path: 'login',
        component: FormLogComponent,
        data: { breadcrumb: 'Login' }
      },
      {
        path: 'mon-compte',
        component: UserProfilPageComponent,
        data: { breadcrumb: 'mon-compte' }
      },
      {
        path: 'nouvelle-adresse',
        component: UserNewAddress,
        data: { breadcrumb: 'nouvelle-adresse' }
      },
      {
        path: 'adresse-edition/:id',
        component: UserUpdateAddress,
        data: { breadcrumb: 'nouvelle-adresse' }
      },
      {
        path: 'historique',
        component: HistoricPageComponent
      },
      {
        path: 'paiement-mode',
        component: PaiementModePageComponent
      },
      {
        path: 'panier',
        component: PanierPageComponent,
        data: { breadcrumb: 'Panier' }
      },
      {
        path: 'paiement',
        component: PaiementPageComponent
      },
      {
        path: 'info-commande',
        component: InformationCommandePageComponent
      },
      {
        path: 'cgu',
        component: CguComponent
      },
      {
        path: 'promotion-page',
        component: PromotionPageComponent
      },
      {
        path: 'suivi-livraison/:idDelivery',
        component: SuiviLivraisonComponent
      },

    ]
  },
  {
    path: 'admin-panel',
    component: AdminPageComponent,
    children: [
      {
        path: "",
        component: UserDisplayComponent
      },

      /*    USERS    */
      {
        path: 'users',
        component: UserDisplayComponent
      },
      {
        path: 'users/create',
        component: UserCreateComponent
      },
      {
        path: 'users/:id',
        component: UserDetailComponent
      },
      {
        path: 'users/:id/order',
        component: UserOrderDetailComponent
      },

      /*    PRODUCTS    */
      {
        path: 'products',
        component: ComponentDisplayComponent
      },
      {
        path: 'products/create',
        component: NewProductPageComponent
      },
      {
        path: 'products/:id',
        component: ComponentDetailComponent
      },
      /*   PROMOTION   */
      {
        path:'promotion/create',
        component: FormulaireCreationPromotionComponent
      },
      {
        path:'promotion/create/:id',
        component: FormulaireCreationPromotionComponent
      },
      /*    CATEGORIES    */
      {
        path: 'categories',
        component:AllCategoriePageComponent
      },
      {
        path: 'categories/create',
        component: NewCategoriePageComponent
      },
      {
        path: 'categories/:id',
        component: CategoryDetailsComponent
      },
      {
        path: 'promotion',
        component: ListProductPromotionComponent
      },



      /*    SUB CATEGORIES    */
      {
        path: 'categories/:id/sub-categories/create',
        component: SubCategoryCreateComponent
      },


      /*      STOCK MANAGEMENT      */
      {
        path: 'stock',
        component: StockDisplay
      },
      {
        path: ':id/stock',
        component: StockManagementComponent
      },
      {
        path: 'stock/:id/add',
        component: StockCreateComponent
      },

      /*      DELIVERY-FEES        */
      {
        path: 'delivery-fees',
        component: DeliveryFeeManagementComponent
      },
      {
        path: 'deliverable-country/create',
        component: DeliverableCountryCreateComponent
      },


      /*      PAYMENT METHODS        */
      {
        path: 'payment-methods',
        component: PaymentMethodsManagementComponent
      },
      /*{
        path: 'payment-methods/create',
        component: PaymentMethodsManagamentComponent
      },*/

    ]
  },
  {
    path: 'authentification',
    component: OtpFormPageComponent
  },
  {
    path: 'reset-password',
    component: ResetPasswordPageComponent
  }

];
