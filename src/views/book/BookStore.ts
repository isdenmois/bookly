import { observable, action } from 'mobx';

interface Book {
    title: string;
    author: string;
    thumbnail: string;
    rating: number;
    description: string;
}

const BASE_URL = 'https://livelib.ru/' + 'apiapp/v2.0',
      SESSION_ID = '5bfdc211bb18f3645cff4ce36c8fdb68',
      USER_AGENT = 'LiveLib/4.0.5/15040005 (SM-G965F; Android 8.0.0; API 26)',
      API_KEY = 'and' + '7' + 'mpp4ss';

export class BookStore {
    @observable bookId: string = '';
    @observable book: Book = null;
    @observable isLoading: boolean = false;

    @action
    loadBook(bookId) {
        this.isLoading = true;
        this.bookId = bookId;

        const fields = 'id,name,author_name,description,pic_140,user_book(book_read,rating)',
              url = `${BASE_URL}/books/${bookId}?andyll=${API_KEY}&session_id=${SESSION_ID}&fields=${fields}`;

        fetch(url, {
            headers: {
                'User-Agent': USER_AGENT,
            },
        })
            .then(res => res.json())
            .then(res => {
                if (res.status.message !== 'OK') {
                    return Promise.reject(res);
                }

                return res;
            })
            .then(res => {
                this.isLoading = false;
                this.book = {
                    title: res.data.name,
                    author: res.data.author_name,
                    thumbnail: res.data.pic_140,
                    rating: res.data.user_book.rating,
                    description: res.data.description,
                };
            })
            .catch(error => {
                console.error(error);
                this.isLoading = false;
            });
    }
}
