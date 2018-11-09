const _ = require('lodash');
const router = require('express').Router({mergeParams: true});
const db = require('./db');
const response = require('./response');

const s = (user, year) => `
  SELECT * FROM challenges
  WHERE user = "${user}" AND year = ${year}
`;

router.get('/', (req, res) => {
  db.get(s(req.params.user, req.params.year), (err, user_challenge) => response.ok(res, {user_challenge}))
});

module.exports = router;
