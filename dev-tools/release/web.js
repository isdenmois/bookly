const { execSync } = require('child_process');
const path = require('path');

exports.web = function (type) {
  const cwd = path.join(__dirname, '../..');
  console.log('Start web build');

  execSync('yarn web:build', { cwd, stdio: 'inherit' });

  if (type === 'release') {
    deploy();
  }
};

function deploy() {
  const cwd = path.join(__dirname, '../../dist');
  console.log('Start deploy web');

  execSync('now --prod', { cwd, stdio: 'inherit' });
}
