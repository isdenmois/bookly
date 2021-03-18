const router = require('express').Router();
const db = require('../stubs/db.json');

updateReadBookDate();

router.get('/:userId/settings.json', (req, res) => {
  if (req.params.userId !== 'e2e') {
    return res.send({});
  }

  res.send(db.settings);
});

router.put('/:userId/settings.json', (req, res) => {
  db.settings = req.body;

  res.send({ ok: true });
});

function updateReadBookDate() {
  let d = new Date();

  d = new Date(d.getFullYear() - 1, d.getMonth(), d.getDay());

  db.books['355'].date = d.getTime();
}

exports.fbdbRouter = router;
