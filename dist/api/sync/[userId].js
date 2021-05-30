const _ = require('lodash');
const database = require('../../lib/firebase');

const withCreatedUpdated = ['books'];
const defaultTables = ['authors', 'books', 'book_authors', 'reviews'];

const METHODS = {
  GET: syncGet,
  POST: syncPost,
};

module.exports = function (req, res) {
  const fn = METHODS[req.method] || METHODS.GET;

  return fn(req, res);
};

async function syncGet(req, res) {
  const startAt = +req.query.sync || 0,
    userId = req.query.userId,
    tables = req.query.tables || req.query['tables[]'] || defaultTables;

  if (!(await isUserExist(userId))) {
    return res.status(404).send({
      message: "User doesn't exist",
    });
  }

  const data = await Promise.all(tables.map(table => getSyncData(table, userId, startAt)));
  const result = {};

  data.forEach(({ table, ...datum }) => {
    result[table] = datum;
  });

  res.send(result);
}

async function syncPost(req, res) {
  const u = +req.query.sync || Date.now();
  const userId = req.query.userId;

  await Promise.all(
    Object.keys(req.body).map(table => {
      const data = req.body[table];

      if (data && data.created) {
        return updateData(data, table, userId, u);
      }

      return null;
    }),
  );

  res.send({ ok: true });
}

function updateData(data, table, userId, u) {
  const updates = {};

  _.forEach(data.created, c => {
    updates[`/${userId}/${table}/${c.id}`] = omitInput(c, { u, c: u });
  });
  _.forEach(data.deleted, id => {
    updates[`/${userId}/${table}/${id}`] = { u };
  });

  return Promise.all([
    database.ref().update(updates),
    ..._.map(data.updated, c => database.ref(`/${userId}/${table}/${c.id}`).update(omitInput(c, { u }))),
  ]);
}

function omitInput(data, u) {
  return _.assign({}, _.omit(data, ['id', '_status', '_changed', 'created_at', 'updated_at']), u);
}

async function getSyncData(table, userId, startAt) {
  const query = database.ref(`/${userId}/${table}`).orderByChild('u').startAt(startAt);

  const snapshot = await query.once('value');

  const data = [];

  snapshot.forEach(childSnapshot => {
    data.push({ id: childSnapshot.key, ...childSnapshot.val() });
  });

  const mapFn = withCreatedUpdated.includes(table) ? mapCreatedUpdated : omit;

  return {
    table,
    created: data.filter(d => d.c > startAt).map(mapFn),
    updated: startAt > 0 ? data.filter(b => b.c && b.c < startAt).map(mapFn) : [],
    deleted: startAt > 0 ? data.filter(b => !b.c).map(d => d.id) : [],
  };
}

function isUserExist(user) {
  return new Promise(resolve => {
    database
      .ref(user)
      .limitToFirst(1)
      .once('value', snapshot => resolve(snapshot.exists()));
  });
}

function omit(data) {
  return _.omit(data, ['c', 'u']);
}

function mapCreatedUpdated(data) {
  return _.assign({ created_at: data.c, updated_at: data.u }, omit(data));
}
