const db = require('./db');
const session_id = '';
const querystring = require('querystring');
const request = require('request-promise-native');
require('dotenv').config();

const BOOK_IDS_QUERY = 'SELECT id from books';
const DEFAULT_OPTIONS = {
  headers: {
    'User-Agent': process.env.USER_AGENT
  }
};
// 'author_id,author_name,name,avg_mark,pic_70,pic_100 ,pic_140,pic_200,id,count_quotes,count_readers,count_reviews,count_stories,description,isbn,publishing,year,series_title,user_book(book_read,rating),langs(name),cycle(title),review_info(next_review_date)'
const FIELDS_TO_UPDATE = ['author_id', 'author_name', 'name', 'avg_mark', 'pic_70', 'pic_100', 'pic_140', 'pic_200', 'description', 'isbn'];

const s = (id, data) => `
  UPDATE books
  SET ${FIELDS_TO_UPDATE.map(f => `${f} = ${JSON.stringify(data[f]).replace(/\\"/g, '')}`).join(', ')}
  WHERE id = ${id}
`;

async function updateBooks(bookIds) {
  if (!bookIds.length) return;

  const bookId = bookIds.pop(),
        query = {
          fields: FIELDS_TO_UPDATE.join(','),
          andyll: process.env.API_KEY,
          session_id
        },
        url = `${process.env.BASE_URL}/books/${bookId}?${querystring.stringify(query)}`,
        options = {...DEFAULT_OPTIONS, url};

  try {
    const data = JSON.parse(await request(options)).data;

    console.log(s(bookId, data));
    db.run(s(bookId, data));
  } catch (e) {
    console.log(e)
  }

  setTimeout(() => updateBooks(bookIds), 1000);
}

db.all(BOOK_IDS_QUERY, (e, rows) => updateBooks(rows.map(r => r.id)));
