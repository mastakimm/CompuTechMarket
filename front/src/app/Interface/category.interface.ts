import {CategorieData} from "../Component/admin-composant/category-display/all-categorie-page.component";

export interface CategoryData {
  id: number;
  name: string;
  subCategories: CategorieData[];
}
