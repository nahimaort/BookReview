import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Book } from 'src/app/model/book';
import { BookService } from 'src/app/services/book.service';
import { ReviewService } from 'src/app/services/review.service';

@Component({
  selector: 'app-book-edition',
  templateUrl: './book-edition.page.html',
  styleUrls: ['./book-edition.page.scss'],
})
export class BookEditionPage implements OnInit {

  book: Book = {
    id: 0,
    name: '',
    author: '',
    published: '',
    isbn: '',
    cover: ''
  };
  
  bookId?: number;

  books: Book[] =  [];
  published: string | undefined;


  constructor(private route: ActivatedRoute,
    private bookService: BookService,
    private reviewService: ReviewService,
    private navController: NavController) { }

  ngOnInit() {
    // Obtenemos la lista de libros para cargar el atributo books que utilizará el componente ion-select 
    this.bookService.getBooks().subscribe((books) => {
      
      this.books = books;
      // Una vez obtenidos los libros, obtenemos la reseña que se envió al pulsar sobre ella en la lista de reseñas
      this.route.queryParams.subscribe(params => {
        if (!!params['book']) {
          this.book = params["book"];
          if(!!this.book.published) {
            // Almacenamos la fecha de creación en el atributo created
            this.published = (new Date(this.book.published)).toISOString(); 
          }
        }
      });
      
    }); 
    
    
  }
  
  saveChanges() {
    /*
    if (!!this.book.id) {
      this.bookService.updateBook(this.book).subscribe(
        resp =>{
          this.navController.navigateForward('books');
        }
      );
    } else {
      this.bookService.createBook(this.book).then(
        resp =>{
          const navExtras: NavigationExtras =  {
            queryParams:{
              newBook: this.book              
            }
          };
          console.log(navExtras);
          this.navController.navigateForward('books');
        }
      );
    }
    */
  }

  delete() {
  }

}
