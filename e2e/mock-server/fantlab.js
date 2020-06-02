const router = require('express').Router();
const _ = require('lodash');
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

exports.fantlabRouter = router;
