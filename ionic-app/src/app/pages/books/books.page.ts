import { Component, OnInit, ViewChild } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { IonInfiniteScroll, NavController } from '@ionic/angular';
import { Book } from 'src/app/model/book';
import { BookService } from 'src/app/services/book.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-books',
  templateUrl: './books.page.html',
  styleUrls: ['./books.page.scss'],
})
export class BooksPage implements OnInit {
  @ViewChild(IonInfiniteScroll, { static: true })
  infiniteScroll?: IonInfiniteScroll;

  page = 0;
  size = 6;

  books: Book[] = [];
  avatarClasses = ['avatar-rojo', 'avatar-verde', 'avatar-azul-claro', 'avatar-azul-oscuro', 'avatar-violeta', 
                   'avatar-amarillo', 'avatar-rosa', 'avatar-naranja', 'avatar-turquesa', 'avatar-verde-limon'];

  constructor(private data: DataService,
              private booksService: BookService,
              private navCtrl: NavController) {}
  

  ngOnInit(): void {
    this.loadBooks(false);
  }



  loadBooks(more = false) {

    this.booksService.getBooks(this.page, this.size).subscribe(
      (bookList: Book[]) => {
        this.page++;

        console.log(this.page);

        this.books = [...this.books, ...bookList];

        if (!!this.infiniteScroll && (!bookList || bookList.length < this.size)) {
          console.log('fin');
          this.infiniteScroll.complete();
          this.infiniteScroll.disabled = true;
          return;
        }
        
        if (!!this.infiniteScroll) {
          this.infiniteScroll.complete();
        }
      }
    )
  }

  addNewBook(): void {
    // Navegamos a la página para crear reseña
    this.navCtrl.navigateForward('book-edition');
  }

  editBook(book: Book): void {
    // Navegamos a la página para editar reseña pasádole la reseña sobre la que hemos clicado
    const navigationExtras: NavigationExtras = {
      queryParams: {
        book
      }
    };
    this.navCtrl.navigateForward('book-edition', navigationExtras);
  }

  getAvatarClass(index: number): string {
   // Obtiene las clases utilizadas en el fondo del avatar del array avatarClasses. Al llegar a 10 vuelve a empezar en 0
   const i = index >= 10 ? index % 10 : index;
   return this.avatarClasses[i];
  }

}
