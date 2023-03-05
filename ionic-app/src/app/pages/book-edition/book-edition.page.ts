import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Book } from 'src/app/model/book';
import { Review } from 'src/app/model/review';
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

  books: Book[] = [];
  reviews?: Review[] = [];
  today: string = (new Date()).toISOString();
  published: string = (new Date()).toISOString();


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
    this.book.published = this.published;
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
  }

  async delete() {
    if (!!this.book.id) {
      await this.getReviewsOfBook();
      await this.deleteReviewsOfBook();
      await this.bookService.deleteBook(this.book.id);
      this.navController.navigateForward('books');
    }
  }
  
  async getReviewsOfBook() {
    if (this.book.id) {
      console.log("Pasa por get");
      this.reviews = await this.reviewService.getReviewsOfABook(this.book.id).toPromise();
    }
  }
  
  async deleteReviewsOfBook() {
    if (this.reviews) {
      for (let review of this.reviews) {
        if (review.id) {
          console.log("Pasa por delete");
          await this.reviewService.deleteReview(review.id);
          console.log('Review deleted:', review.id);
        }
      }
    }
  }
  
}
