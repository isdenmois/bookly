const router = require('express').Router();
const _ = require('lodash');

const db = require('./mocks/db.json');

router.get('/:userId', (req, res) => {
  const startAt = +req.query.sync || 0;

  const [authors, books, book_authors, reviews] = [
    getSyncData('authors', startAt),
    getSyncData('books', startAt),
    getSyncData('book_authors', startAt),
    getSyncData('reviews', startAt),
  ];

  res.send({ authors, books, book_authors, reviews });
});

router.post('/:userId', (req, res) => {
  let u = +req.query.sync || Date.now();

  updateData(req.body.books, 'books', u);
  updateData(req.body.authors, 'authors', u);
  updateData(req.body.book_authors, 'book_authors', u);
  req.body.reviews && updateData(req.body.reviews, 'reviews', u);

  res.send({ ok: true });
});

function getSyncData(table, startAt) {
  const data = _.map(db[table], (r, id) => ({ ...r, id })).filter(r => r.u >= startAt);

  return {
    created: data.filter(d => d.c > startAt).map(d => _.omit(d, ['c', 'u'])),
    updated: data.filter(b => b.c && b.c < startAt).map(d => _.omit(d, ['c', 'u'])),
    deleted: data.filter(b => !b.c).map(d => d.id),
  };
}

function updateData(data, table, u) {
  _.forEach(data.created, c => _.set(db, `${table}.${c.id}`, omit(c, u)));
  _.forEach(data.updated, c => _.set(db, `${table}.${c.id}`, omit(c, u)));
  _.forEach(data.deleted, id => _.set(db, `${table}.${id}`, omit({ u })));
}

function omit(data, u) {
  return _.assign({}, _.omit(data, ['id', '_status', '_changed']), { c: u, u });
}

exports.syncRouter = router;
exports.db = db;
