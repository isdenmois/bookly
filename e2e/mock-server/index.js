const express = require('express');
const bodyParser = require('body-parser');
// const morgan = require('morgan');
const { syncRouter } = require('./firebase');
const { fantlabRouter } = require('./fantlab');
const { fbdbRouter } = require('./fbdb');
const { livelibRouter } = require('./livelib');

class Mockserver {
  constructor(port) {
    this.app = express();
    this.server = null;
    this.port = port || 9001;
  }

  init() {
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());
    // this.app.use(morgan('combined'));

    this.app.use('/firebase', syncRouter);
    this.app.use('/fantlab', fantlabRouter);
    this.app.use('/fbdb', fbdbRouter);
    this.app.use('/livelib', livelibRouter);

    this.server = this.app.listen(this.port);
    console.log('Mock server listening on port ' + this.port);
  }

  close() {
    this.server.close();
  }
}

module.exports = Mockserver;

if (process.env.NODE_ENV !== 'test') {
  new Mockserver().init();
}
