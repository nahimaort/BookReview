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
  size = 7;

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
    
    // Si no solicitamos más, es porque estamos pidiendo la primera página
    if (!more) {
      this.page = 0
    }
    
    // Llamamos al servicio para obtener la lista de reseñas pasándole la paǵina y el número
    // de elementos por página
    this.booksService.getBooks(this.size).subscribe(
      (bookList: Book[]) => {
        
        // Se ha obtenido una respuesta correcta del servicio, añadimos la lista de reseñas 
        // obtenida en la respuesta al atributo reviews
        this.books = [...this.books, ...bookList];

        // Si está cargado el infinite scroll y no viene ninguna lista o el tamaño es menor que el número de 
        // elementos por página, entonces  hemos llegado a la última página. Por lo tanto, desactivamos el infinite scroll
        if (!!this.infiniteScroll && (!bookList || bookList.length < this.size)) {
          console.log('fin');
            this.infiniteScroll.disabled = true;
            return;
        }
        
        // En caso de no haber llegado a la última página, aumentamos el contador de página y marcamos como completada 
        // la operación del infinite scroll
        this.page++;
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
