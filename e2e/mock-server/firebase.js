const router = require('express').Router();
const _ = require('lodash');

const db = require('../stubs/db.json');
const withCreatedAt = ['books'];
const defaultTables = ['authors', 'books', 'book_authors', 'reviews'];

router.get('/sync/:userId', (req, res) => {
  const startAt = +req.query.sync || 0;
  const tables = req.query.tables || defaultTables;

  if (req.params.userId !== 'e2e') {
    return res.status(404).send({
      message: "User doesn't exist",
    });
  }

  const data = tables.map(table => getSyncData(table, startAt));
  const result = {};

  data.forEach(({ table, ...datum }) => {
    result[table] = datum;
  });

  res.send(result);
});

router.post('/sync/:userId', (req, res) => {
  const u = +req.query.sync || Date.now();

  _.forEach(req.body, (data, table) => data?.created && updateData(data, table, u));

  res.send({ ok: true });
});

function getSyncData(table, startAt) {
  const data = _.map(db[table], (r, id) => ({ ...r, id })).filter(r => r.u >= startAt);
  const mapFn = withCreatedAt.includes(table) ? mapCreated : omitGet;

  return {
    table,
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
