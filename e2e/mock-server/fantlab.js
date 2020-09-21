const router = require('express').Router();
const mocks = require('../stubs/fantlab.json');

router.get('/work/:workId/extended', (req, res) => {
  const workId = req.params.workId;

  res.send(mocks.work[workId]);
});

router.get('/work/:workId/similars', (req, res) => {
  const workId = req.params.workId;

  res.send(mocks.similars[workId]);
});

router.get('/work/:workId/responses', (req, res) => {
  const workId = req.params.workId;

  res.send(mocks.responses[workId]);
});

router.get('/search-works', (req, res) => {
  const q = req.query.q;
  const matches = mocks.search.filter(w => w.name.includes(q));

  res.send({ matches, total: matches.length });
});

exports.fantlabRouter = router;
