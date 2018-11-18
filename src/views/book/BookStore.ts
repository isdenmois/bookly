import { action, observable } from 'mobx'
import { api } from 'api/api'

interface Book {
  title: string;
  author: string;
  thumbnail: string;
  rating: number;
  description: string;
}

export class BookStore {
  @observable bookId: string     = ''
  @observable book: Book         = null
  @observable isLoading: boolean = false

  @action
  loadBook(bookId) {
    this.isLoading = true
    this.bookId    = bookId

    const fields = 'id,name,author_name,description,pic_140,user_book(book_read,rating)'

    api.getBook({bookId}, fields)
      .then(data => {
        this.isLoading = false
        this.book      = {
          title: data.name,
          author: data.authorName,
          thumbnail: data.pic140,
          rating: data.userBook.rating,
          description: data.description,
        }
      })
      .catch(error => {
        console.error(error)
        this.isLoading = false
      })
  }
}
