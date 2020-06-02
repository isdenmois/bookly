const router = require('express').Router();
const _ = require('lodash');

const db = require('../stubs/db.json');
const withCreatedAt = ['books'];

router.get('/sync/:userId', (req, res) => {
  const startAt = +req.query.sync || 0;
  if (req.params.userId !== 'e2e') {
    return res.status(404).send({
      message: "User doesn't exist",
    });
  }

  const [authors, books, book_authors, reviews] = [
    getSyncData('authors', startAt),
    getSyncData('books', startAt),
    getSyncData('book_authors', startAt),
    getSyncData('reviews', startAt),
  ];

  res.send({ authors, books, book_authors, reviews });
});

router.post('/sync/:userId', (req, res) => {
  let u = +req.query.sync || Date.now();

  updateData(req.body.books, 'books', u);
  updateData(req.body.authors, 'authors', u);
  updateData(req.body.book_authors, 'book_authors', u);
  req.body.reviews && updateData(req.body.reviews, 'reviews', u);

  res.send({ ok: true });
});

function getSyncData(table, startAt) {
  const data = _.map(db[table], (r, id) => ({ ...r, id })).filter(r => r.u >= startAt);
  const mapFn = withCreatedAt.includes(table) ? mapCreated : omitGet;

  return {
    created: data.filter(d => d.c > startAt).map(mapFn),
    updated: startAt > 0 ? data.filter(b => b.c && b.c < startAt).map(mapFn) : [],
    deleted: startAt > 0 ? data.filter(b => !b.c).map(d => d.id) : [],
  };
}

function updateData(data, table, u) {
  _.forEach(data.created, c => _.set(db, `${table}.${c.id}`, omit(c, u)));
  _.forEach(data.updated, c => _.set(db, `${table}.${c.id}`, omit(c, u)));
  _.forEach(data.deleted, id => _.set(db, `${table}.${id}`, omit({ u })));
}

function mapCreated(data) {
  return _.assign({ created_at: data.c }, omitGet(data));
}

function omit(data, u) {
  return _.assign({}, _.omit(data, ['id', '_status', '_changed']), { c: u, u });
}

function omitGet(data) {
  return _.omit(data, ['c', 'u']);
}

exports.syncRouter = router;
exports.db = db;
