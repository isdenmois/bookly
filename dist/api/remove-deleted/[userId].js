const _ = require('lodash');
const database = require('../../lib/firebase');

module.exports = async function removeDeleted(req, res) {
  const userId = req.query.userId;
  const updates = {
    ...(await removeDeletedFromTable(userId, 'book_authors')),
    ...(await removeDeletedFromTable(userId, 'books')),
    ...(await removeDeletedFromTable(userId, 'reviews')),
  };

  await database.ref().update(updates);

  res.send({ ok: true, deleted: Object.keys(updates).length });
};

async function removeDeletedFromTable(userId, table) {
  const query = database.ref(`/${userId}/${table}`).orderByChild('c').startAt(null).endAt(null);

  const snapshot = await query.once('value');

  const result = {};

  snapshot.forEach(childSnapshot => {
    result[`/${userId}/${table}/${childSnapshot.key}`] = null;
  });

  return result;
}
