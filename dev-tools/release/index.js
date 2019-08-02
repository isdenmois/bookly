require('dotenv').config();
const { build } = require('./gradle');
const { upload } = require('./upload');

const argv = require('yargs')
  .option('type', { default: 'release' })
  .boolean('test')
  .boolean('clean')
  .boolean('upload')
  .help().argv;

build(argv.type, argv.clean, argv.test)
  .then(apk => argv.upload && upload(apk))
  .catch(error => console.error(error && error.toString()));
