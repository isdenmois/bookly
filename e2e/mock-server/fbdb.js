const router = require('express').Router();
const db = require('../stubs/db.json');

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

exports.fbdbRouter = router;
