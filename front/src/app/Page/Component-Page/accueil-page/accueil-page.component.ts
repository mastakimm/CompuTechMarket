import {Component, OnInit} from '@angular/core';
import {Les2blockComponent} from "../../../Component/les2block/les2block.component";
import {
  CarrousselAccueilComponent
} from "../../../Component/small components/carroussel-accueil/carroussel-accueil.component";


@Component({
  selector: 'app-accueil-page',
  standalone: true,
  imports: [
    Les2blockComponent,
    CarrousselAccueilComponent
  ],
  templateUrl: './accueil-page.component.html',
  styleUrl: './accueil-page.component.css'
})
export class AccueilPageComponent implements OnInit{

  ngOnInit() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

}
