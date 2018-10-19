const _ = require('lodash');
const router = require('express').Router({mergeParams: true});
const db = require('./db');
const response = require('./response');

const WHERE_TYPES = {
  read: 'book_read = 1',
  wish: 'book_read = 0 OR book_read = 2'
};

const s = (user, year) => `
  SELECT * FROM challenges
  WHERE user = "${user}" AND year = ${year}
`;

router.get('/', (req, res) => {
  db.get(s(req.params.user, req.params.year), (err, user_challenge) => response.ok(res, {user_challenge}))
});

module.exports = router;
