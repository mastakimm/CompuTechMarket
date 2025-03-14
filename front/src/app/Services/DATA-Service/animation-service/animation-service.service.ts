import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AnimationServiceService {

  constructor() { }

  public sideBarAnimation:boolean=false;

  setSideBarAnimation(){
    this.sideBarAnimation=!this.sideBarAnimation;
    return this.sideBarAnimation;
  }

  getSideBarAnimation(){

    const chevron = document.getElementById('chevron');

    if(!this.sideBarAnimation){
      // @ts-ignore
      chevron.style.display = 'none';

    }else{
      // @ts-ignore
      chevron.style.display = 'block';

    }

    return this.sideBarAnimation;
  }
}
