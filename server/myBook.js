const router = require('express').Router({mergeParams: true});
const db = require('./db');
const response = require('./response');

const s = (bookId, params) => `
  UPDATE user_book_partial
  SET ${params}
  WHERE book_id = ${bookId}
`;

const updateChallenge = `
  UPDATE challenges
  SET count_books_read = count_books_read + 1,
      count_books_forecast = count_books_forecast + 1
`;

router.patch('/:bookId', (req, res) => {
  const params = [];

  if (req.query.book_read) {
    params.push(`book_read = ${req.query.book_read}`)
  }

  if (+req.query.book_read === 1) {
    db.run(updateChallenge)
  }

  if (req.query.date_day) {
    params.push(`date_day = ${req.query.date_day}`)
  }

  if (req.query.date_month) {
    params.push(`date_month = ${req.query.date_month}`)
  }

  if (req.query.date_year) {
    params.push(`date_year = ${req.query.date_year}`)
  }

  if (req.query.rating) {
    params.push(`rating = ${req.query.rating}`)
  }

  db.run(s(req.params.bookId, params.join(', ')), response.ok(res, {
    id: req.params.bookId,
    user_book: {
      book_read: req.query.book_read,
      date_day: req.query.date_day,
      date_month: req.query.date_month,
      date_year: req.query.date_year,
      rating: req.query.rating
    }
  }))
});

module.exports = router;
