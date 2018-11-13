const router = require('express').Router();
const db = require('./db');
const response = require('./response');

const s = (q, limit, offset, count = false) => `
  SELECT ${count ? 'COUNT(*) as count' : '*'} FROM books b
  LEFT JOIN user_book_partial p ON b.id = p.book_id
  WHERE lower(name) LIKE "%${q}%" or lower(author_name) LIKE "%${q}%" OR lower(description) LIKE "%${q}%"
  ${count ? '' : `LIMIT ${limit} OFFSET ${offset}`}
`;

router.get('/', (req, res) => {
  const { q, start, count } = req.query;

  db.get(s(q.toLowerCase(), count, start - 1, true), (e, total) => {
    db.all(s(q.toLowerCase(), count, start - 1), (err, rows) => response.ok(res, rows.map(r => ({
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
    })), total.count))
  });
});

module.exports = router;
