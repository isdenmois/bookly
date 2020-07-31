require('dotenv').config();
const { execSync } = require('child_process');
const { build } = require('./gradle');
const { upload } = require('./upload');
const { web } = require('./web');

const argv = require('yargs')
  .option('type', { default: 'release' })
  .boolean('test')
  .boolean('clean')
  .boolean('upload')
  .boolean('major')
  .boolean('skip-version')
  .option('web', { type: 'boolean', default: true })
  .help().argv;

if (argv.type === 'release' && !argv.skipVersion) {
  execSync(`node dev-tools/changelog ${argv.major ? '--major' : ''}`, { stdio: 'inherit' });
}

build(argv.type, argv.clean, argv.test)
  .then(apk => argv.upload && upload(apk))
  .then(() => argv.web && web(argv.type))
  .catch(error => console.error(error && error.toString()));
