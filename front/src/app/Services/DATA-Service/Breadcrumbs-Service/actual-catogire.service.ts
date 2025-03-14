import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ActualCatogireService {

  constructor() { }

  public actualCategorie: string | undefined;

  getActualCategorie(){
    return this.actualCategorie;
  }

  setActualCategorie(data: any){
    this.actualCategorie = data;
  }
}
