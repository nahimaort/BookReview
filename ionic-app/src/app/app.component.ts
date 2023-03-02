import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  menuOpts: any[] = [
    {"name": "Reseñas",
    "redirectTo": "/reviews"},
    {"name": "Libros",
    "redirectTo": "/books"}
];

  constructor(private menuController: MenuController) {}

  showMenu() {
    this.menuController.open('mainMenu');
  }
}


