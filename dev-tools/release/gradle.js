const { spawn } = require('child_process');
const path = require('path');
const fg = require('fast-glob');

exports.build = async function build() {
  const cwd = path.join(__dirname, '../../android');

  console.log('Start gradle build');

  await runGradle(cwd);

  return findApk(cwd);
};

function runGradle(cwd) {
  return new Promise((resolve, reject) => {
    const gradlew = spawn('gradlew.bat', ['clean', 'assembleRelease'], { cwd, shell: true });

    gradlew.stdout.on('data', data => {
      console.log(data.toString());
    });

    gradlew.stderr.on('data', data => {
      console.log(`stderr: ${data}`);
    });

    gradlew.on('error', reject);

    gradlew.on('close', code => {
      if (code === 0) {
        resolve();
      } else {
        reject();
      }
    });
  });
}

function findApk(cwd) {
  const files = fg.sync('app/build/outputs/apk/**/*.apk', { cwd });

  if (files.length > 0) {
    const localPath = files[files.length - 1];

    return path.join(cwd, localPath);
  }
}
