const express = require('express');
const bodyParser = require('body-parser');
const { syncRouter } = require('./sync');
const { fantlabRouter } = require('./fantlab');

class Mockserver {
  constructor() {
    this.app = express();
    this.server = null;
  }

  init() {
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());

    const port = 9001;

    this.app.use('/sync', syncRouter);
    this.app.use('/fantlab', fantlabRouter);

    this.server = this.app.listen(port);
    console.log('Mock server listening on port ' + port);
  }

  close() {
    this.server.close();
  }
}

module.exports = Mockserver;

if (process.env.NODE_ENV !== 'test') {
  new Mockserver().init();
}
