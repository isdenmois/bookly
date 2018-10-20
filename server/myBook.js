const router = require('express').Router({mergeParams: true});
const db = require('./db');
const response = require('./response');

const s = (bookId, params) => `
  UPDATE user_book_partial
  SET ${params}
  WHERE book_id = ${bookId}
`;

router.patch('/:bookId', (req, res) => {
  const params = [];

  if (req.query.book_read) {
    params.push(`book_read = ${req.query.book_read}`)
  }

  if (req.query.date_day) {
    params.push(`date_day = ${req.query.date_day}`)
  }

  if (req.query.date_month) {
    params.push(`date_month = ${req.query.date_day}`)
  }

  if (req.query.date_year) {
    params.push(`date_year = ${req.query.date_day}`)
  }

  if (req.query.rating) {
    params.push(`rating = ${req.query.rating}`)
  }

  db.run(s(req.params.bookId, params.join(', ')), response.ok(res, {
    id: req.params.bookId,
    user_book: {
      book_read: req.query.book_read,
      rating: req.query.rating
    }
  }))
});

module.exports = router;
