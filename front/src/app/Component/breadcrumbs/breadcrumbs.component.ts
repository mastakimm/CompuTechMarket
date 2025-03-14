import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import {CategoryService} from "../../Services/DATA-Service/Breadcrumbs-Service/breadcrumb.service";

interface Breadcrumb {
  label: string;
  url: string;
}

@Component({
  selector: 'app-breadcrumbs',
  standalone: true,
  templateUrl: './breadcrumbs.component.html',
  imports: [
    RouterLink,
    NgForOf,
    NgIf,
    NgClass
  ],
  styleUrls: ['./breadcrumbs.component.css']
})
export class BreadcrumbsComponent {
  breadcrumbs: Breadcrumb[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private categoryService: CategoryService
  ) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.breadcrumbs = [];
      this.buildBreadcrumbs(this.route.root);
    });
  }

  private buildBreadcrumbs(route: ActivatedRoute, url: string = '', breadcrumbs: Breadcrumb[] = []): void {
    const children: ActivatedRoute[] = route.children;

    if (children.length === 0) {
      this.breadcrumbs = breadcrumbs;
      return;
    }

    for (const child of children) {
      const routeURL: string = child.snapshot.url.map(segment => segment.path).join('/');
      if (routeURL !== '') {
        url += `/${routeURL}`;
      }

      let label = child.snapshot.data['breadcrumb'] || routeURL;

      if (child.snapshot.paramMap.keys.length > 0) {
        child.paramMap.pipe(
          switchMap(params => {
            const categoryId = params.get('categoryId');
            const productId = params.get('productId');
            if (productId) {
              return this.categoryService.getProductNameById(productId).pipe(
                switchMap(productName => {
                  return this.categoryService.getCategoryNameById(categoryId).pipe(
                    switchMap(categoryName => {
                      breadcrumbs.push({
                        label: 'Catégorie',
                        url: '/categorie'
                      });
                      breadcrumbs.push({
                        label: categoryName,
                        url: `/categorie/${categoryId}`
                      });
                      breadcrumbs.push({
                        label: productName,
                        url: url
                      });
                      this.buildBreadcrumbs(child, url, breadcrumbs);
                      return of('');
                    })
                  );
                })
              );
            } else if (categoryId) {
              return this.categoryService.getCategoryNameById(categoryId).pipe(
                switchMap(categoryName => {
                  breadcrumbs.push({
                    label: 'Catégorie',
                    url: '/categorie'
                  });
                  breadcrumbs.push({
                    label: categoryName,
                    url: url
                  });
                  this.buildBreadcrumbs(child, url, breadcrumbs);
                  return of('');
                })
              );
            } else {
              return of(label);
            }
          })
        ).subscribe();
      } else {
        breadcrumbs.push({
          label,
          url
        });
        this.buildBreadcrumbs(child, url, breadcrumbs);
      }
    }
  }
}
