import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CrudComponentService } from '../../Services/DATA-Service/CRUD-product-service/crud-component.service';
import { ItemCardComponent } from "../item-card/item-card.component";
import { NgForOf, NgIf } from "@angular/common";
import { BuyButtonComponent } from "../small components/boutons/buy-button/buy-button.component";
import { AddToCartButtonComponent } from "../small components/boutons/add-to-cart-button/add-to-cart-button.component";
import { ActualCatogireService } from "../../Services/DATA-Service/Breadcrumbs-Service/actual-catogire.service";
import { PromotionService } from "../../Services/DATA-Service/promotion/promotion.service";
import {
  SkeletonProductDetailComponent
} from "../small components/skeleton-product-detail/skeleton-product-detail.component";

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
  imports: [
    ItemCardComponent,
    NgForOf,
    NgIf,
    BuyButtonComponent,
    AddToCartButtonComponent,
    SkeletonProductDetailComponent
  ],
  standalone: true
})
export class ProductDetailComponent implements OnInit {
  product = {
    id: 0,
    name: '',
    description: '',
    manufacturer: '',
    model: '',
    price: 0,
    quantity: 0,
    type: '',
    mainImage: '',
    specifications: {},
    additionalImages: [],
    variants: [] as { id: number; color: string }[],
    color: '',
    originalPrice: 0,
    promotion: '',
    weight: 0,
    width: 0,
    height: 0,
    length: 0,
    created_at: '',  // Ajoutez cette propriété pour la date de création
  };

  public stockColor: string | undefined;
  public visibleSpecifications: { value: unknown; key: string }[] = [];
  public showAllSpecifications = false;
  public randomProducts: any[] = [];
  public productId: string | null = '';
  public loading: boolean = true;
  public isNew: boolean = false; // Propriété pour indiquer si le produit est nouveau

  constructor(
    private route: ActivatedRoute,
    private CrudComponentService: CrudComponentService,
    private router: Router,
    private actualCategorie: ActualCatogireService,
    private promotionService: PromotionService,
  ) {}

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.route.paramMap.subscribe(params => {
      this.productId = params.get('productId');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (this.productId) {
        this.loadProductDetails(this.productId);
      }
    });

    this.fetchRandomProducts(4);
  }

  loadProductDetails(productId: string) {
    this.promotionService.getProductPromotionWithProductId(productId).subscribe(
      promotionData => {
        if (promotionData.body && promotionData.body.length > 0) {
          this.loading = false;
          this.assignProductData(promotionData.body[0], true);
        } else {
          this.loadStandardProductDetails(productId);
        }
      },
      error => {
        console.error('Error fetching product promotion details', error);
        this.loadStandardProductDetails(productId);
      }
    );
  }

  loadStandardProductDetails(productId: string) {
    this.CrudComponentService.getComponentById(productId).subscribe(
      data => {
        this.assignProductData(data.body, false);
        this.loading = false;
        if (data.body.quantity < 5) {
          this.stockColor = "#ef6363";
        } else if (data.body.quantity >= 5 && data.body.quantity < 20) {
          this.stockColor = "orange";
        } else {
          this.stockColor = "#0ad60a";
        }

        this.CrudComponentService.addNewProductVue(this.productId).subscribe();
      },
      error => {
        console.error('Error fetching standard product details', error);
      }
    );
  }

  assignProductData(data: any, hasPromotion: boolean) {
    this.product.id = data.id;
    this.product.name = data.name;
    this.product.description = data.description;
    this.product.manufacturer = data.manufacturer;
    this.product.model = data.model;
    this.product.originalPrice = data.price;
    this.product.weight = data.weight;
    this.product.length = data.length;
    this.product.width = data.width;
    this.product.height = data.height;
    this.product.created_at = data.created_at;  // Assigner la date de création

    if (hasPromotion && data.promotions) {
      this.product.price = parseFloat(
        this.promotionService.setNewPrice({ price: data.price }, data.promotions[0].promotion)
      );
      this.product.promotion = data.promotions[0].promotion;
    } else {
      this.product.price = data.price;
    }
    this.product.quantity = data.quantity;
    this.product.type = data.productSubCategory?.name || '';
    this.product.specifications = this.parseSpecifications(data.specifications);
    this.product.mainImage = data.files[0]?.file || '';
    this.product.additionalImages = data.files.map((fileObj: { file: any }) => fileObj.file);
    this.product.variants = data.variants as { id: number; color: string }[];
    this.product.color = data.color;

    this.checkIfNewProduct();
    this.updateVisibleSpecifications();
  }

  checkIfNewProduct() {
    const createdAt = new Date(this.product.created_at);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - createdAt.getTime());
    const diffHours = diffTime / (1000 * 60 * 60);
    this.isNew = diffHours <= 48;
  }

  fetchRandomProducts(count: number): void {

    let rdmId1 = Math.floor(Math.random() * (8 + 1) +1);
    let rdmId2 = Math.floor(Math.random() * (16 - 9 + 1))+9;
    let rdmId3 = Math.floor(Math.random() * (20 - 17 + 1))+17;
    let rdmId4 = Math.floor(Math.random() * (27 - 21 + 1))+21;

    const selectedIds = [rdmId1, rdmId2, rdmId3, rdmId4];

    const fetchPromises = selectedIds.map(id =>
      this.CrudComponentService.getComponentById(id.toString()).toPromise()
    );

    Promise.all(fetchPromises)
      .then(responses => {
        this.randomProducts = responses.map(response => response.body);
      })
      .catch(error => {
        console.error('Error fetching random products:', error);
      });
  }

  getRandomIds(count: number, maxId: number): number[] {
    const ids = new Set<number>();

    while (ids.size < count) {
      const randomId = Math.floor(Math.random() * maxId) + 1;
      ids.add(randomId);
    }

    return Array.from(ids);
  }

  updateVisibleSpecifications() {
    const specsArray = Object.entries(this.product.specifications).map(([key, value]) => ({ key, value }));
    if (this.showAllSpecifications) {
      this.visibleSpecifications = specsArray;
    } else {
      this.visibleSpecifications = specsArray.slice(0, 5);
    }
  }

  toggleSpecifications() {
    this.showAllSpecifications = !this.showAllSpecifications;
    this.updateVisibleSpecifications();
  }

  changeMainImage(image: string) {
    this.product.mainImage = image;
  }

  parseSpecifications(input: string) {
    let dataString = input.trim();
    if (dataString.startsWith('{') && dataString.endsWith('}')) {
      dataString = dataString.substring(1, dataString.length - 1).trim();
    }

    dataString = dataString.replace(/([\'’\w\séèàùêëïîçûâô]+):/g, (match, p1) => {
      return `"${p1.trim()}":`;
    });

    dataString = dataString.replace(/:\s*([^,}]+)/g, (match, p1) => {
      return `: "${p1.trim()}"`;
    });

    dataString = dataString.replace(/"\s*"([^"]+)"\s*"/g, '"$1"');

    dataString = `{${dataString}}`;
    try {
      return JSON.parse(dataString);
    } catch (error) {
      console.error('Error parsing specifications:', error);
      return {};
    }
  }

  redirectVariantes(idProduct: Number) {
    this.CrudComponentService.getComponentById(idProduct.toString()).subscribe(
      data => {
        const categorieName = data.body.productSubCategory?.name || '';
        this.actualCategorie.setActualCategorie(categorieName);
        this.router.navigate([`categorie/${categorieName}`, idProduct]);
      },
      error => {
        console.log(error);
      }
    );
  }

  reloadProduct() {
    this.product.quantity = this.product.quantity - 1;
  }
}
