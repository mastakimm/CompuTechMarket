import { Injectable } from '@angular/core';
import { ApiService } from "../../API-Service/api.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CrudComponentService {

  constructor(private apiService: ApiService) { }

                        /*        PRODUCTS          */
  createComponent(data: any): Observable<any> {
    return this.apiService.post('admin/add-component', data);
  }

  deleteComponent(id: string | null | undefined): Observable<any> {
    return this.apiService.delete(`admin/delete-component/${id}`);
  }

  updateComponent(id: string | null | undefined, data: any): Observable<any> {
    return this.apiService.patch(`admin/update-component/${id}`, data);
  }

  getAllComponents(): Observable<any> {
    return this.apiService.get('component/all');
  }

  getAllProductsWithStocks(): Observable<any> {
    return this.apiService.get('admin/products/stocks');
  }

  getComponentById(id: string | null | undefined | number): Observable<any> {
    return this.apiService.get(`component/${id}`);
  }

  getComponentByName(name: string | null){
    return this.apiService.get(`component?name=${name}`);
  }

  getComponentByTypeAndName( Type: string | null,name: string | null){
    return this.apiService.get(`component/type/${Type}?name=${name}`);
  }

  getLastAddedProduct() {
    return this.apiService.get('admin/component/last');
  }

  getTwoPopularProducts(){
    return this.apiService.get(`visiteArticle/mostVisited`);
  }
  addNewProductVue(id: string | null){
    return this.apiService.post(`visiteArticle/incrementComponent?componentId=${id}`);
  }

                                /*          CATEGORY          */

  createComponentType(name: { name: any; picture: string }){
    const data = {
      name: name.name,
      picture: name.picture
    };
    return this.apiService.post(`admin/add-component-type`, data);
  }

  getComponentByType(id: number | undefined): Observable<any> {
    return this.apiService.get(`component/type/${id}`);
  }

  getAllComponentsType(){
    return this.apiService.get(`componentType/all`);
  }

  updateCategory(id: number | null | undefined, data: any): Observable<any> {
    return this.apiService.patch(`admin/updateProductCategory/${id}`, data);
  }

  deleteCategory(id: number | null | undefined): Observable<any> {
    return this.apiService.delete(`admin/deleteProductCategory/${id}`);
  }


                                /*          SUB CATEGORY        */
  createProductSubCategory(name: { name: any; parentCategoryId: number | null }){
    const data = {
      name: name.name,
      parentCategoryId: name.parentCategoryId

    };
    return this.apiService.post(`admin/sub-category`, data);
  }

  getCategorySubCategories(id: number | undefined) {
    return this.apiService.get(`componentType/${id}/sub-categories`);
  }

  getComponentsBySubCategory(subCategoryId: number | null) {
    return this.apiService.get(`component/sub-categories/${subCategoryId}`);
  }

  getCategoryById(categoryId: number) {
    return this.apiService.get(`componentType/${categoryId}`)
  }

  updateSubCategory(subCategoryId: number, updatedSubCategory: any) {
    return this.apiService.patch(`admin/sub-category/${subCategoryId}`, updatedSubCategory);
  }

  deleteSubCategory(subCategoryId: number) {
    return this.apiService.delete(`admin/sub-category/${subCategoryId}`);
  }

        /*          Deliveries          */
  createDeliverableCountry(data: { countryName: any }) {
    return this.apiService.post('admin/country/add', data);
  }

  getDeliverableCountries() {
    return this.apiService.get('admin/country');
  }

  getDeliverableCountryById(id: number | null) {
    return this.apiService.get(`admin/country/${id}`);
  }


        /*          FEES-MANAGEMENT          */
  updateDeliverySpeedFee(id: number | null, data: any) {
    return this.apiService.put(`admin/delivery-fee/speed/${id}`, data);
  }

  updateDeliveryMethodFee(id: number | null, data: any) {
    return this.apiService.put(`admin/delivery-fee/method/${id}`, data);
  }



  /*          STOCK-MANAGEMENT          */
  getProductStockHistory(productId: number | null) {
    return this.apiService.get(`admin/stocks/${productId}/refill-history`);
  }

  createNewStockDelivery(delivery: any) {
    return this.apiService.post(`admin/stocks`, delivery);
  }

  updateStockDelivery(deliveryId: number | null, delivery: any) {
    return this.apiService.put(`admin/stocks/${deliveryId}`, delivery);
  }

  deleteStockDelivery(deliveryId: number | null) {
    return this.apiService.delete(`admin/stocks/${deliveryId}`);
  }

  getDeliveriesByProductId(productId: number | null) {
    return this.apiService.get(`admin/stock/${productId}/refill-history`);
  }

  getOldestDeliveryByProductId(productId: number | null) {
    return this.apiService.get(`admin/stock/${productId}/oldest-refill`);
  }

  getCountryPaymentMethods(countryId: number | null) {
    return this.apiService.get(`country/${countryId}`);
  }

  authorizePaymentMethod(selectedCountryId: number, paymentMethodId: any) {
    return this.apiService.post(`admin/country/${selectedCountryId}/payment-method/${paymentMethodId}`);
  }

  deletePaymentMethod(selectedCountryId: number, paymentMethodId: any) {
    return this.apiService.delete(`admin/country/${selectedCountryId}/payment-method/${paymentMethodId}`);
  }

  getPaymentMethodIdByName(paymentMethodName: string) {
    const body = { name: paymentMethodName };
    return this.apiService.post(`payment-methods/getByName`, body);
  }


  /* STOCK MANAGEMENT CLIENT SIDE */

  decreaseStock(productId: Number, quantity: number){
    return this.apiService.put(`stocks/${productId}/${quantity}`);
  }

  validateDecreaseStock(body:any){
    return this.apiService.post(`product-reservation`, body);
  }

  addToStock(body:any){
    return this.apiService.delete(`product-reservation`, body);
  }
}
