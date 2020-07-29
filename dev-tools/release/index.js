require('dotenv').config();
const { execSync } = require('child_process');
const { build } = require('./gradle');
const { upload } = require('./upload');

const argv = require('yargs')
  .option('type', { default: 'release' })
  .boolean('test')
  .boolean('clean')
  .boolean('upload')
  .boolean('major')
  .help().argv;

if (argv.type === 'release') {
  execSync(`node dev-tools/changelog ${argv.major ? '--major' : ''}`, { stdio: 'inherit' });
}

build(argv.type, argv.clean, argv.test)
  .then(apk => argv.upload && upload(apk))
  .catch(error => console.error(error && error.toString()));
