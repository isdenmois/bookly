const router = require('express').Router();
const mocks = require('../stubs/livelib.json');

router.get('/books', (req, res) => {
  const q = req.query.q;
  const data = mocks.search.filter(w => w.name.includes(q));

  res.send({ data, count: data.length });
});

exports.livelibRouter = router;
