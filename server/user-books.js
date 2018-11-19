const router = require('express').Router({mergeParams: true});
const db = require('./db');
const response = require('./response');

const WHERE_TYPES = {
  read: 'book_read = 1',
  wish: 'book_read = 0 OR book_read = 2'
};

const s = (user, type) => `
  SELECT * FROM books b
  LEFT JOIN user_book_partial p ON b.id = p.book_id
  WHERE p.user = "${user}" AND (${WHERE_TYPES[type]})
`;

router.get('/', (req, res) => {
  db.all(s(req.params.user, req.params.type), (err, rows) => response.ok(res, rows.map(r => ({
    id: r.id,
    name: r.name,
    author_id: r.author_id,
    author_name: r.author_name,
    avg_mark: r.avg_mark,
    pic_70: r.pic_70,
    pic_100: r.pic_100,
    pic_140: r.pic_140,
    pic_200: r.pic_200,
    description: r.description,
    isbn: r.isbn,
    user_book_partial: {
      book_read: r.book_read,
      rating: r.rating
    }
  }))))
});

module.exports = router;
